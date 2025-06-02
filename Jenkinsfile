pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        MONGO_DB_URI = credentials('MONGO_DB_URI')
        JWT_SECRET = credentials('JWT_SECRET')
        HOST = '0.0.0.0'
        PORT = '5000'
        SONAR_TOKEN = credentials('sonarqube-token')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/anjpai/JobBoard-for-Campus.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
                bat 'cd client && npm install'
            }
        }

        stage('Build and Deploy') {
            steps {
                lock(resource: 'backend-port-5000') {
                    script {
                        bat "docker build -t rpaianjali/jobboardforcampus-server:${env.BUILD_ID} -f server/Dockerfile server"
                        bat "docker build -t rpaianjali/jobboardforcampus-client:${env.BUILD_ID} -f client/Dockerfile client"

                        docker.withRegistry('', 'dockerhub-creds') {
                            docker.image("rpaianjali/jobboardforcampus-server:${env.BUILD_ID}").push()
                            docker.image("rpaianjali/jobboardforcampus-client:${env.BUILD_ID}").push()
                        }

                        writeFile file: '.env', text: """
                        MONGO_DB_URI=${env.MONGO_DB_URI}
                        JWT_SECRET=${env.JWT_SECRET}
                        HOST=${env.HOST}
                        PORT=${env.PORT}
                        """

                        bat 'docker-compose down || exit 0'
                        bat 'docker-compose up -d --force-recreate --build'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                        script {
                            def scannerHome = tool 'SonarScanner'
                            bat "\"${scannerHome}\\bin\\sonar-scanner\" -Dsonar.login=%SONAR_TOKEN%"
                        }
                    }
                }
            }
        }

        stage('ZAP Baseline Scan') {
            steps {
                script {
                    def linuxPath = env.WORKSPACE.replaceAll('\\\\', '/').replaceAll('^([A-Za-z]):', '/$1').toLowerCase()
                    bat """
                        docker run --rm -v "${linuxPath}:/zap/wrk" ^
                        ghcr.io/zaproxy/zaproxy:stable zap-baseline.py ^
                        -t http://host.docker.internal:3000 ^
                        -r zap-report.html ^
                        -l FAIL ^
                        -I || exit 0
                    """
                }
            }
        }

    }
}
