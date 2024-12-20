import express from 'express';
const app = express();
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import router from './routes/mainRoutes.js';

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.get('/', (req, res) => {
    res.send('헬로 월드💥');
});

app.listen(3000, function() {
    console.log("[💥 시작] : frontend 서버");
})