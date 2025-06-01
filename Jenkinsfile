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
                    // Try to bring down previous containers, ignore errors
                    bat 'docker-compose down || exit 0'
                    bat 'docker-compose up -d'
                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {  // Use your actual SonarQube server name here
                    bat 'SonarScanner'
                }
            }
        }


    }
}
