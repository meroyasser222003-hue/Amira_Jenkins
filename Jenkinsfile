pipeline{
  agent any
  environment{
    VENV = 'venv'
  }
  stages{
    stage('Checkout Out'){
      steps{
        git branch: 'main', url: 'https://github.com/Parth2k3/test-django'
      }
    }
    stage('Set up VENV'){
      steps{
        sh 'python3 -m venv venv'
        sh 'venv/bin/python -m pip install --upgrade pip'
        sh 'venv/bin/python -m pip install -r requirements.txt'
      }
    }
    stage('Run the tests'){
      steps{
        sh 'venv/bin/python manage.py test'
      }
    }
  }
}
