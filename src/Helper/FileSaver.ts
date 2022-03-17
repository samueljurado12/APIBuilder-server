const fs = require('fs')

const FileSaver = (strPath: string, data: string) => {
    strPath = strPath.replace(/\\/g, '/')

    let root = ''
    if(strPath[0] === '/'){
        root = '/';
        strPath = strPath.slice(1);
    } else if (strPath[1] === ':'){
        root = strPath.slice(0, 3);
        strPath = strPath.slice(3);
    }

    const folders = strPath.split('/').slice(0, -1)
    folders.reduce(
        (acc, folder) => {
            const folderpath = acc + folder + '/';
            if(!fs.existsSync(folderpath)) fs.mkdirSync(folderpath);
            return folderpath;
        },
        root
    );

    fs.writeFileSync(root+strPath, data);
}

export default FileSaver;
