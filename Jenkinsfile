pipeline {

    agent any

    environment {
        DOCKER_IMAGE   = 'meroyasser222003/school-website'
        DOCKER_TAG     = "${env.BUILD_NUMBER}"
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
                        -t ${env.DOCKER_IMAGE}:${env.DOCKER_TAG} \
                        -t ${env.DOCKER_IMAGE}:${env.DOCKER_LATEST} \
                        .
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '📤 رفع الـ Image على Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: "${env.DOCKER_CREDS}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}
                        docker push ${env.DOCKER_IMAGE}:${env.DOCKER_LATEST}
                        docker logout
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 تشغيل الـ Container...'
                sh """
                    docker stop ${env.CONTAINER_NAME} || true
                    docker rm   ${env.CONTAINER_NAME} || true

                    docker run -d \
                        --name ${env.CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${env.HOST_PORT}:${env.CONTAINER_PORT} \
                        ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}

                    sleep 3
                    docker ps | grep ${env.CONTAINER_NAME}
                """
            }
        }

        stage('Show URL') {
            steps {
                script {
                    def ip = sh(script: "hostname -I | awk '{print \$1}'", returnStdout: true).trim()
                    echo """
╔══════════════════════════════════════════════════╗
║                                                  ║
║   ✅ الموقع شغّال بنجاح!                         ║
║                                                  ║
║   🌐 افتح الموقع من هنا:                        ║
║                                                  ║
║   👉  http://${ip}:${env.HOST_PORT}              ║
║                                                  ║
║   أو على نفس الجهاز:                            ║
║   👉  http://localhost:${env.HOST_PORT}          ║
║                                                  ║
╚══════════════════════════════════════════════════╝
"""
                }
            }
        }

    }

    post {
        success {
            echo "✅ Build #${env.BUILD_NUMBER} نجح — الموقع يعمل على البورت ${env.HOST_PORT}"
        }
        failure {
            echo "❌ Build #${env.BUILD_NUMBER} فشل — راجع الـ logs"
        }
    }
}
