const handleCreateItem = async (itemData) => {
    try {
      // 向服务器端发送请求以创建新的Item
      const response = await fetch('/createItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
  
      if (response.ok) {
        const itemResponse = await response.json(); // 假设服务器返回创建成功的项目数据
        console.log('Item created successfully:', itemResponse);
        // 这里可以根据返回的项目数据进行后续处理
      } else {
        console.error('Item creation failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during item creation:', error);
    }
  };
  
  export {handleCreateItem};
  