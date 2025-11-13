pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        BACKEND_IMAGE = 'health-backend'
        FRONTEND_IMAGE = 'health-frontend'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/yourusername/healthcare_management.git'
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Building backend Docker image...'
                sh 'docker build -t ${BACKEND_IMAGE} ./backend'
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend Docker image...'
                sh 'docker build -t ${FRONTEND_IMAGE} ./frontend'
            }
        }

        stage('Run Docker Compose') {
            steps {
                echo 'Starting full stack with Docker Compose...'
                sh 'docker compose -f ${DOCKER_COMPOSE_FILE} up -d'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests (you can add your npm or pytest commands here)'
                // Example: sh 'docker exec backend npm test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                // Later we’ll connect this to Terraform or Kubernetes
            }
        }
    }

    post {
        always {
            echo 'Cleaning up containers...'
            sh 'docker compose down'
        }
    }
}
