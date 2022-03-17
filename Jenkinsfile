pipeline {
    agent any

    tools {
        nodejs "nodejs"
    }

    stages {
        stage('SetupBackend') {
            steps {
              dir('backend'){
                sh "npm install"
              }
            }
        }
        
        stage('SetupFrontend') {
            steps {
              dir('frontend'){
                sh "npm install"
              }
            }
        }
        stage('StartBackend') {
            steps {
              dir('backend'){
                sh "node server.js"
              }
            }
        }
        stage('StartFrontend') {
            steps {
              dir('frontend'){
                sh "npm start"
              }
            }
        }
    }
}
