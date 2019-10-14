import './styles/index.css';
import bookImg from './assets/book.png' 

const test = () => {
  const app = document.getElementById('app');
  app.innerHTML = `<h1>你好，世界</h1><img src="${bookImg}" />`
  console.log("启动了！！！")
}

test()