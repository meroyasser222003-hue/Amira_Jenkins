pipeline {

    agent any

    environment {
        DOCKER_IMAGE   = 'amirayasser2003/school-website'
        DOCKER_TAG     = "${BUILD_NUMBER}"
        DOCKER_LATEST  = 'latest'
        DOCKER_CREDS   = 'dockerhub-credentials'
        CONTAINER_NAME = 'school-website-container'
        HOST_PORT      = '9090'
        CONTAINER_PORT = '80'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 سحب الكود من GitHub...'
                git branch: 'main',
                    url: 'https://github.com/meroyasser222003-hue/Amira_Jenkins.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 بناء الـ Image..."
                sh """
                    docker build \
                        -t ${DOCKER_IMAGE}:${DOCKER_TAG} \
                        -t ${DOCKER_IMAGE}:${DOCKER_LATEST} \
                        .
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '📤 رفع الـ Image على Docker Hub...'

                withCredentials([usernamePassword(
                    credentialsId: DOCKER_CREDS,
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                        docker push ${DOCKER_IMAGE}:${DOCKER_LATEST}
                        docker logout
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 تشغيل الـ Container...'
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
            }
        }

        stage('Show URL') {
            steps {
                echo """
===============================
✅ Deployment Successful!

👉 Open:
http://localhost:${HOST_PORT}

===============================
"""
            }
        }
    }

    post {
        success {
            echo "✅ Build #${BUILD_NUMBER} نجح"
        }
        failure {
            echo "❌ Build فشل - راجعي اللوج"
        }
    }
}
