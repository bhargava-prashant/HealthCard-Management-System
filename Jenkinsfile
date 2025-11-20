pipeline {
    agent any
    environment {
        DOCKERHUB_CRED = credentials('dockerhub')
        AWS_ACCESS_KEY_ID = credentials('aws-access-key')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-key')
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/yourusername/health-booking-system.git'
            }
        }
        stage('Build Backend') {
            steps {
                script {
                    docker.build("yourusername/health-backend", "./backend")
                }
            }
        }
        stage('Build Frontend') {
            steps {
                script {
                    docker.build("yourusername/health-frontend", "./frontend")
                }
            }
        }
        stage('Push Images') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        docker.image('yourusername/health-backend').push('latest')
                        docker.image('yourusername/health-frontend').push('latest')
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    # Use kubectl to deploy to AWS EKS
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                '''
            }
        }
    }
}
