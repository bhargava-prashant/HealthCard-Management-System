pipeline {
    agent any
    environment {
        DOCKERHUB_CRED = credentials('dockerhub')
        AWS_ACCESS_KEY_ID = credentials('aws-access-key')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-key')
    }
    stages {
        stage('Cleanup') {
            steps {
                deleteDir()
            }
        }
        stage('Checkout') {
            steps {
                // Checkout the repository
                git branch: 'master', url: "https://github.com/bhargava-prashant/HealthCard-Management-System.git"
            }
        }
        stage('Build Backend') {
            steps {
                script {
                    docker.build("prashantbhargava365/health-backend", "./backend")
                }
            }
        }
        stage('Build Frontend') {
            steps {
                script {
                    // Wrap path in quotes to handle spaces in Jenkins workspace
                    docker.build("prashantbhargava365/health-frontend", "\"./frontend\"")
                }
            }
        }
        stage('Push Images') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        docker.image('prashantbhargava365/health-backend').push('latest')
                        docker.image('prashantbhargava365/health-frontend').push('latest')
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f k8s/deployment.yaml
                kubectl apply -f k8s/service.yaml
                '''
                }
        }
    }
}
