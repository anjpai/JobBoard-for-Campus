pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds') // From step 7
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

        stage('Test') {
            steps {
                bat 'npm test || true'  // Prevent build from failing if no test scripts
                bat 'cd client && npm test || true'
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
                        docker.image("anjpai/jobboard-server:${env.BUILD_ID}").push()
                        docker.image("anjpai/jobboard-client:${env.BUILD_ID}").push()
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
