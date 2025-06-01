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
                    bat 'docker-compose down || exit 0'
                    bat 'docker-compose up -d'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScanner'
                        bat "${scannerHome}\\bin\\sonar-scanner"
                    }
                }
            }
        }

        stage('ZAP Baseline Scan') {
            steps {
                script {
                    def linuxPath = toDockerPath(env.WORKSPACE)
                    // On Windows, we can't use returnStatus easily, so we run and ignore the error
                    // You can use a try-catch block in Groovy to ignore the error, or use a wrapper script
                    // Here's a simple solution using a wrapper script (recommended)
                    // Create a file named run_zap.bat in your workspace:
                    /*
                    @echo off
                    docker run --rm -v "%1:/zap/wrk" ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:3000 -r zap-report.html -l FAIL -I
                    exit /b 0
                    */
                    // Then in your pipeline:
                    bat "run_zap.bat \"${linuxPath}\""
                    // Or, if you don't want to create a file, you can use this:
                    bat """
                        docker run --rm -v "${linuxPath}:/zap/wrk" ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:3000 -r zap-report.html -l FAIL -I
                        exit 0
                    """
                }
            }
        }
    }
}
