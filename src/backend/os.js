var multer = require('multer');
const fs = require('fs')
const path = require('path')
const { PassThrough, Writable } = require('stream');
const { spawn, fork } = require('child_process');

let os = async function (req, res) {
    const chapter = req.body.chapter || req.query.func
    const func = req.body.func
    const path = 'static/delete/vid.mp4'
    let process_ = {
        posix: function (req, res) {
            //stdout
            let i = 0;
            process.stdout.cork();
            for (i = 0; i < 5; i++) {
                let ok = process.stdout.write(`${i}word\n`);
                if(ok == false) {
                    //drain will be invoked
                    process.stdout.once('drain', ()=>{
                        console.log("now it is drained")
                    })
                }
            }
            console.log(process.stdout.writableHighWaterMark)
            console.log(process.stdout.writableLength);
            process.stdout.uncork();

            const pass = new PassThrough();
            const writable = new Writable();
            // readable.readableFlowing === null --> true
            pass.pipe(writable);
            // readable.readableFlowing to be set as false
            pass.unpipe(writable);

            pass.on('data', (chunk) => { 
                console.log(chunk.toString()); });
            pass.write('word');  // Will not emit 'data' for now
            pass.resume();

            // stdin
            let buffer = fs.createReadStream(path);
            // console.log(buffer.readableLength)
            buffer.on('data', (chunk)=>{
                console.log("second")
                buffer.destroy();
            })
            console.log("first")
            return res.send("posix api received")
        },
        child_proc: function() {
            //execute as soon as process start
            let forked = fork('./src/backend/fork.js')
            //does not wait for fork
            forked.on('message', (msg)=>{
                console.log('message from child: ' + msg);
            })
            forked.send('greetings')
        },
        scoket_io: function() {
            
        }
    }
    let thread = {

    }

    switch (chapter) {
        case "process":
            if (typeof process_[func] == "function") {
                process_[func](req, res);
            }
            break;
        case "thread":
            if (typeof thread[func] == "function") {
                thread[func]();
            }
            break;
        case "upload":
            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, 'static/delete')
                },
                filename: function (req, file, cb) {
                    cb(null, Date.now() + '-' + file.originalname)
                }
            })
            let upload = multer({ storage: storage }).any()
            upload(req, res, function (err) {
                console.log("file uploaded complete")
                if (err instanceof multer.MulterError) {
                    console.log(err)
                    return res.status(500).json(err)
                } else if (err) {
                    console.log(err)
                    return res.status(500).json(err)
                }
                return res.status(200).send("ok")
            })
            break;
            case "video_stream":
                const path = 'static/delete/vid.mp4'
                const stat = fs.statSync(path)
                const fileSize = stat.size
                const range = req.headers.range
                if (range) {
                    const parts = range.replace(/bytes=/, "").split("-")
                    const start = parseInt(parts[0], 10)
                    const end = parts[1]
                        ? parseInt(parts[1], 10)
                        : fileSize - 1
    
                    if (start >= fileSize) {
                        res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
                        return
                    }
    
                    const chunksize = (end - start) + 1
                    const file = fs.createReadStream(path, { start, end })
                    const head = {
                        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunksize,
                        'Content-Type': 'video/mp4',
                    }
    
                    res.writeHead(206, head)
                    file.pipe(res)
                } else {
                    const head = {
                        'Content-Length': fileSize,
                        'Content-Type': 'video/mp4',
                    }
                    res.writeHead(200, head)
                    fs.createReadStream(path).pipe(res)
                }
            break;
        default:
            console.log('wrong chapter')
            return res.end("error");
    }
}


export default os;