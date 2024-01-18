import './App.css';
import React from "react"
import AllRoutes from './routes/AllRoutes';
import "../src/assets/css/style.scss"
import { ConfigProvider } from 'antd';

function App() {
  return (
    <div className="App">

      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Poppins",
            colorPrimary: "#f48805",
            colorTextPlaceholder: "#000",
          },
        }}
      >
        <AllRoutes />
      </ConfigProvider>
    </div>
  );
}

export default App;