pipeline {
    agent any

    stages {

        stage('Checkout Out') {
            steps {
                git branch: 'main',
                url: 'https://github.com/meroyasser222003-hue/Amira_Jenkins.git'
            }
        }

        stage('Verify Files') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Test Website') {
            steps {
                sh 'test -f index.html'
                sh 'test -f style.css'
                sh 'test -f script.js'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t photo-gallery .'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh 'docker stop photo-container || true'
                sh 'docker rm photo-container || true'
                sh 'docker run -d -p 8085:80 --name photo-container photo-gallery'
            }
        }

    }
}
