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
                bat '''
                    set MONGO_DB_URI=%MONGO_DB_URI%
                    set JWT_SECRET=%JWT_SECRET%
                    set HOST=%HOST%
                    set PORT=%PORT%
                    npm start || true
                '''
                bat '''
                    cd client
                    npm start || true
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
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
            }
        }
    }
}
