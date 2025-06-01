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

        stage('Start') {
            steps {
                // Use PowerShell for better environment handling on Windows
                powershell '''
                    $env:MONGO_DB_URI = "${env.MONGO_DB_URI}"
                    $env:JWT_SECRET = "${env.JWT_SECRET}"
                    $env:HOST = "${env.HOST}"
                    $env:PORT = "${env.PORT}"

                    npm start
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    docker.build("rpaianjali/jobboardforcampus-server:${env.BUILD_ID}", '.')
                    docker.build("rpaianjali/jobboardforcampus-client:${env.BUILD_ID}", './client')
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
                // Assuming docker-compose is available on your Windows agent
                bat 'docker-compose down || exit 0'
                bat 'docker-compose up -d'
            }
        }
    }
}
