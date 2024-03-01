// 在 App.js 或相应的组件中

const handleGetCompanyInfo = async () => {
    try {
      const response = await fetch('/getCompanyInfo'); // 调整为您的后端地址，如果后端和前端不在同一域，需要完整的 URL
      if (!response.ok) throw new Error('Failed to fetch company info');
      const data = await response.json();
      console.log('hit the getCompanyInfo')
      console.log(data);
      // 在这里处理返回的公司信息，例如显示到 UI 中
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  export {handleGetCompanyInfo}
  