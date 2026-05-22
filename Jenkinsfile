pipeline {
    agent any

    stages {

        stage('Checkout Out') {
            steps {
                git branch: 'main', url: 'https://github.com/meroyasser222003-hue/Amira_Jenkins.git'
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

        stage('Deploy') {
            steps {
                echo 'Website deployed successfully'
            }
        }
    }
}
