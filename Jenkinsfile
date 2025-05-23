pipeline {
    agent any
    environment {
        ORGANIZATION_NAME = 'dgamboav'
        PROJECT_NAME = 'NuevoProyectoGeneradoFront'
        GITHUB_REPO_URL = "https://github.com/${env.ORGANIZATION_NAME}/${env.PROJECT_NAME}.git"
        SONAR_SERVER_NAME = 'idea-sonarqube-instance' // Usar el nombre configurado en Jenkins
        SONAR_PROJECT_KEY = "${env.ORGANIZATION_NAME}:${env.PROJECT_NAME}" // Ejemplo de clave
        APP_IP = '34.135.44.219'
        PHRASE = 'Idea2025*'
        FRONTEND_PORT = '80'
        APP_URL = "http://${env.APP_IP}" // URL base de tu aplicación
    }
    stages {
        stage('Checkout') {
            steps {
                git url: env.GITHUB_REPO_URL, branch: 'main' // o tu rama por defecto
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
		stage('Deploy') {
			steps {
				script {
					def remoteHost = "${env.APP_IP}"
					def remoteUser = 'dgamboav'
					def appNameBase = "${env.PROJECT_NAME}"
					def workspaceDir = pwd() // Directorio del workspace de Jenkins
					def credId = 'pruebas-ssh-without-encrypt' // ID de tus credenciales SSH de Jenkins
                    def REMOTE_DEPLOY_DIR = "/home/${remoteUser}/apps/${env.PROJECT_NAME}" // Directorio de despliegue del frontend

                    withCredentials([sshUserPrivateKey(credentialsId: credId, keyFileVariable: 'identity', passphraseVariable: '', usernameVariable: remoteUser)]) {
					
					def remote = [
						name: remoteHost,
						host: remoteHost,
						user: remoteUser,
						identityFile: identity,
						allowAnyHosts: true // Considera configurar knownHosts para mayor seguridad en producción
					]
					
                        // 1. Detener el servidor web (si es necesario)
                        echo "Deteniendo el servidor web (si está corriendo en ${env.REMOTE_HOST}:${env.FRONTEND_PORT})"
                        sshCommand remote: remote, command: "sudo systemctl stop nginx", failOnError: false
                        // ^^^ AJUSTA 'nginx' con el nombre de tu servicio web

                        // 2. Esperar a que se detenga (opcional)
                        sleep time: 5, unit: 'SECONDS'

                        // 3. Borrar la build anterior en el servidor (opcional)
                        echo "Borrando la build anterior en: ${REMOTE_DEPLOY_DIR}"
                        sshCommand remote: remote, command: "rm -rf ${REMOTE_DEPLOY_DIR}", failOnError: false

                       // 4. Borrar la configuración anterior (opcional)
                        echo "Borrando la configuración anterior de Nginx para ${env.PROJECT_NAME}"
                        sshCommand remote: remote, command: "sudo rm -f /etc/nginx/sites-available/${env.PROJECT_NAME}.conf", failOnError: false
                        sshCommand remote: remote, command: "sudo rm -f /etc/nginx/sites-enabled/${env.PROJECT_NAME}.conf", failOnError: false


			            // 5. Crear el directorio de despliegue
                        echo "Creando el directorio de despliegue: ${REMOTE_DEPLOY_DIR}"
                        sshCommand remote: remote, command: "mkdir -p ${REMOTE_DEPLOY_DIR}", failOnError: true

                        // 5. Copiar el archivo de configuración generado
                        echo "Copiando la configuración de Nginx desde el proyecto hacia el servidor"
			    
			            sshPut remote: remote, from: "${workspaceDir}/src/server/nginx.conf", into: "${REMOTE_DEPLOY_DIR}/${env.PROJECT_NAME}.conf", failOnError: true
			            sshCommand remote: remote, command: """    sudo mv "${REMOTE_DEPLOY_DIR}/${env.PROJECT_NAME}.conf" "/etc/nginx/sites-available/${env.PROJECT_NAME}.conf" """, failOnError: true
			    
                        // 7. Copiar la nueva build (la carpeta 'dist') al servidor
                        echo "Copiando la nueva build desde: ${workspaceDir}/dist hacia: ${REMOTE_DEPLOY_DIR}"
		                sshPut remote: remote, from: "${workspaceDir}/dist/", into: "${REMOTE_DEPLOY_DIR}/", recursive: true, failOnError: true

                        // 8. Ajustar permisos (si es necesario)
                        echo "Ajustando permisos en el directorio de despliegue"
                        sshCommand remote: remote, command: "sudo chown -R ${remoteUser}:${remoteUser} ${REMOTE_DEPLOY_DIR}/dist", failOnError: false

                        // 9. Ajustar permisos para el usuario de Nginx (www-data)
                        echo "Ajustando permisos para el usuario www-data en el directorio de despliegue"
                        sshCommand remote: remote, command: "sudo chown -R :www-data ${REMOTE_DEPLOY_DIR}", failOnError: false
                        sshCommand remote: remote, command: "sudo chmod -R g+rx ${REMOTE_DEPLOY_DIR}", failOnError: false
                        echo "Ajustando permisos de lectura para otros en los archivos"
                        sshCommand remote: remote, command: "sudo chmod -R o+r ${REMOTE_DEPLOY_DIR}/*", failOnError: false
                        echo "Ajustando permisos de ejecución para otros en los directorios"
                        sshCommand remote: remote, command: "sudo chmod -R o+x ${REMOTE_DEPLOY_DIR}", failOnError: false

                        // 10. Configurar el servidor web (ejemplo con Nginx)
                        sshCommand remote: remote, command: "sudo ln -sf /etc/nginx/sites-available/${env.PROJECT_NAME}.conf /etc/nginx/sites-enabled/", failOnError: false
                        sshCommand remote: remote, command: "sudo systemctl restart nginx", failOnError: true

                        echo "Frontend de la aplicación ${env.PROJECT_NAME} desplegado en http://${env.APP_IP}:${env.FRONTEND_PORT}"
					
                    }
				}
			}
		}
		
    }
}
