import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";


const socket = io('https://billing-resturant-api.onrender.com/');
socket.on("connect",()=>{alert("✅ Connected to backend server successfully.")});
export default socket;