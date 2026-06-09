import time
import paramiko

if not hasattr(paramiko, 'DSSKey'):
    class DummyDSSKey: pass
    paramiko.DSSKey = DummyDSSKey

from sshtunnel import SSHTunnelForwarder

SSH_HOST = "ssh.pythonanywhere.com"
SSH_USER = "WorldITSocialNetwork"
SSH_PASSWORD = "oL4qhR8vzO9p"

DB_HOST = "WorldITSocialNetwork-5274.postgres.pythonanywhere-services.com"
DB_PORT = 15274

LOCAL_PORT = 5433 

try:
    print(f"🚀 Запуск SSH-туннеля для Prisma...")
    server = SSHTunnelForwarder(
        (SSH_HOST, 22),
        ssh_username=SSH_USER,
        ssh_password=SSH_PASSWORD,
        remote_bind_address=(DB_HOST, DB_PORT),
        local_bind_address=('127.0.0.1', LOCAL_PORT)
    )
    
    server.start()
    
    print("\n" + "="*50)
    print(f"🔒 ТУННЕЛЬ УСПЕШНО ОТКРЫТ!")
    print(f"👉 Адрес для Prisma: localhost:{LOCAL_PORT}")
    print("="*50)
    print("Оставьте это окно терминала открытым.")
    print("Для закрытия туннеля нажмите Ctrl + C...")
    
    while True:
        time.sleep(1)

except KeyboardInterrupt:
    print("\n🛑 Закрытие туннеля...")
    server.stop()
    print("Туннель закрыт. До связи!")
except Exception as e:
    print(f"❌ Ошибка: {e}")