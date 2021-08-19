const dropArea = document.querySelector(".drop-area");
const dragText = dropArea.querySelector("h2");
const button = dropArea.querySelector("button");
const input = dropArea.querySelector("#input-file");

button.addEventListener("click", (e) => {
    input.click();
});

input.addEventListener("change", (e) => {
    files = input.files;
    dropArea.classList.add("active");
    showFiles(files);
    dropArea.classList.remove("active");
});

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Suelta para subir los archivos";
});

dropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropArea.classList.remove("active");
    dragText.textContent = "Arrastra y suelta los archivos";
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    files = e.dataTransfer.files;
    showFiles(files);
    dropArea.classList.remove("active");
    dragText.textContent = "Arrastra y suelta los archivos";
});

function showFiles(files) {
    if(files.length == undefined) {
        processFile(files);
    } else {
        for(const file of files) {
            processFile(file);
        }
    }
}

function processFile(file) {
    const docType = file.type;
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if(validExtensions.includes(docType)) {
        //ARCHIVO VALIDO
        const fileReader = new FileReader();
        const id = `file-${Math.random().toString(32).substring(7)}`;

        fileReader.addEventListener('load', e => {
            const fileUrl = fileReader.result;
            const image = `
                <div id="${id}" class="file-container">
                    <img src="${fileUrl}" alt="${file.name}" width="50">
                    <div class="status">
                        <span>${file.name}</span>
                        <span class="status-text">
                            Cargando...
                        </span>
                    </div>
                </div>
            `;
            const html = document.querySelector("#preview").innerHTML;
            document.querySelector("#preview").innerHTML = image + html;
        });

        fileReader.readAsDataURL(file);
        uploadFile(file, id);
    } else {
        //NO ES UN ARCHIVO VALIDO
        alert("Archivo no valido");
    }
}

async function uploadFile(file, id) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch('http://127.0.0.1:3000/upload', {
            method: "POST",
            body: formData
        });

        const responseText = await response.text();
        console.log(responseText);

        document.querySelector(
            `#${id} .status-text`
        ).innerHTML = `<span class="success">Archivo subido correctamente</span>`
    } catch(error) {
        document.querySelector(
            `#${id} .status-text`
        ).innerHTML = `<span class="failure">Archivo no se subio correctamente</span>`
    }
}