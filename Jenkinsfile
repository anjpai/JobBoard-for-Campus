def toDockerPath(winPath) {
    winPath = winPath.replaceAll('\\\\', '/')
    winPath = winPath.replaceAll('^([A-Za-z]):', '/$1')
    return winPath.toLowerCase()
}

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

        stage('Build Docker Images') {
            steps {
                script {
                    bat "docker build -t rpaianjali/jobboardforcampus-server:${env.BUILD_ID} -f server/Dockerfile server"
                    bat "docker build -t rpaianjali/jobboardforcampus-client:${env.BUILD_ID} -f client/Dockerfile client"
                }
            }
        }

        stage('Push Images') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-creds') {
                        docker.image("rpaianjali/jobboardforcampus-server:${env.BUILD_ID}").push()
                        docker.image("rpaianjali/jobboardforcampus-client:${env.BUILD_ID}").push()
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Pass environment variables to docker-compose via .env file or CLI
                    // Here we create a temporary .env file with needed variables
                    writeFile file: '.env', text: """
                    MONGO_DB_URI=${env.MONGO_DB_URI}
                    JWT_SECRET=${env.JWT_SECRET}
                    HOST=${env.HOST}
                    PORT=${env.PORT}
                    """

                    // Stop and remove existing containers, ignoring errors
                    bat 'docker-compose down || exit 0'

                    // Start containers with detached mode and force recreate to pick new images/env
                    bat 'docker-compose up -d --force-recreate --build'
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
                    def linuxPath = toDockerPath(env.WORKSPACE)
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
