const handleLogin = async () => {
    try {
      // 向服务器端发送请求以获取认证 URI
      const response = await fetch('/authUri');
      if (response.ok) {
        const authUri = await response.text();
        // 导航到认证 URL
        window.location.href = authUri;
        console.log('From AutoLogin.js')
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during auto login:', error);
    }
  };

  export {handleLogin}