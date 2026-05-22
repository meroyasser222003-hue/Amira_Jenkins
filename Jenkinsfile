// ====================================
// Jenkinsfile — CI/CD Pipeline
// Static Website → Docker → Deploy
// ====================================

pipeline {

    agent any

    // ── تعديل هنا: اكتب بيانات الـ Docker Hub/Registry بتاعتك ──
    environment {
        DOCKER_IMAGE   = 'your-dockerhub-username/school-website'  // ← غيّر الاسم
        DOCKER_TAG     = "${env.BUILD_NUMBER}"
        DOCKER_LATEST  = 'latest'
        GITHUB_REPO    = 'https://github.com/your-username/your-repo.git' // ← غيّر الرابط
        DOCKER_CREDS   = 'dockerhub-credentials'   // اسم الـ Credential في Jenkins
        GITHUB_CREDS   = 'github-credentials'      // اسم الـ Credential في Jenkins (إن كان private)
        CONTAINER_NAME = 'school-website-container'
        HOST_PORT      = '8080'   // البورت على السيرفر
        CONTAINER_PORT = '80'
    }

    // ── تشغيل تلقائي كل push على main ──
    triggers {
        githubPush()
    }

    stages {

        // ────────────────────────────────
        // 1. سحب الكود من GitHub
        // ────────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 سحب الكود من GitHub...'
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: "${env.GITHUB_REPO}",
                        credentialsId: "${env.GITHUB_CREDS}"
                    ]]
                ])
            }
        }

        // ────────────────────────────────
        // 2. التحقق من الملفات
        // ────────────────────────────────
        stage('Verify Files') {
            steps {
                echo '🔍 التحقق من ملفات المشروع...'
                sh '''
                    echo "--- محتويات المشروع ---"
                    ls -la
                    echo ""
                    echo "✅ index.html موجود:"
                    test -f index.html && echo "نعم" || echo "❌ غير موجود!"
                    echo "✅ style.css موجود:"
                    test -f style.css  && echo "نعم" || echo "❌ غير موجود!"
                    echo "✅ script.js موجود:"
                    test -f script.js  && echo "نعم" || echo "❌ غير موجود!"
                '''
            }
        }

        // ────────────────────────────────
        // 3. بناء Docker Image
        // ────────────────────────────────
        stage('Build Docker Image') {
            steps {
                echo "🐳 بناء Docker Image: ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
                sh """
                    docker build \
                        -t ${env.DOCKER_IMAGE}:${env.DOCKER_TAG} \
                        -t ${env.DOCKER_IMAGE}:${env.DOCKER_LATEST} \
                        .
                """
            }
        }

        // ────────────────────────────────
        // 4. رفع Image على Docker Hub
        // ────────────────────────────────
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

        // ────────────────────────────────
        // 5. إيقاف الـ Container القديم وتشغيل الجديد
        // ────────────────────────────────
        stage('Deploy Container') {
            steps {
                echo '🚀 نشر الـ Container الجديد...'
                sh """
                    # إيقاف وحذف الـ Container القديم (إن وُجد)
                    docker stop ${env.CONTAINER_NAME} || true
                    docker rm   ${env.CONTAINER_NAME} || true

                    # تشغيل الـ Container الجديد
                    docker run -d \
                        --name ${env.CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${env.HOST_PORT}:${env.CONTAINER_PORT} \
                        ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}

                    echo ""
                    echo "✅ الموقع شغّال على: http://\$(hostname -I | awk '{print \$1}'):${env.HOST_PORT}"
                """
            }
        }

        // ────────────────────────────────
        // 6. تنظيف الـ Images القديمة
        // ────────────────────────────────
        stage('Cleanup') {
            steps {
                echo '🧹 تنظيف الـ Images القديمة...'
                sh 'docker image prune -f || true'
            }
        }

    }

    // ────────────────────────────────
    // إشعارات نهاية الـ Build
    // ────────────────────────────────
    post {
        success {
            echo """
            ╔══════════════════════════════════╗
            ║  ✅ Build رقم ${env.BUILD_NUMBER} نجح!       ║
            ║  🌐 الموقع يعمل بنجاح             ║
            ╚══════════════════════════════════╝
            """
        }
        failure {
            echo """
            ╔══════════════════════════════════╗
            ║  ❌ Build رقم ${env.BUILD_NUMBER} فشل!       ║
            ║  راجع الـ logs أعلاه              ║
            ╚══════════════════════════════════╝
            """
        }
        always {
            echo '📋 انتهى الـ Pipeline.'
        }
    }
}
