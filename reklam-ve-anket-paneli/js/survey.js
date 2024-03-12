let questions = [];

function addQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-block';
    const questionId = 'question-' + (questionContainer.children.length + 1);
    questionDiv.id = questionId;

    // Soru input alanı
    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.placeholder = 'Soru';
    questionInput.className = 'question-input';
    questionDiv.appendChild(questionInput);

    // Cevap tipi seçimi
    const questionTypeSelect = document.createElement('select');
    questionTypeSelect.className = 'question-type-select';
    const optionTypes = ['Cevap Tipini Seçiniz', 'Kısa Cevap', 'Paragraf', 'Çoktan Seçmeli', 'Onay Kutusu', 'Açılır Liste', 'Tarih', 'Zaman'];
    optionTypes.forEach(type => {
        let option = document.createElement('option');
        option.value = type;
        option.text = type;
        questionTypeSelect.appendChild(option);
    });
    questionTypeSelect.onchange = () => handleQuestionTypeChange(questionTypeSelect, questionDiv);
    questionDiv.appendChild(questionTypeSelect);

    // Cevap seçenekleri için konteyner
    const answerOptionsContainer = document.createElement('div');
    answerOptionsContainer.className = 'answer-options-container';
    questionDiv.appendChild(answerOptionsContainer);

    // Soru nesnesi
    const question = {
        questionDiv,
        questionInput,
        questionTypeSelect,
        answerOptions: [],
        mandatory: null // Bu alanı sonra ayarlayacağız
    };

    // Cevap Seçeneği Ekle butonu
    const addOptionButton = document.createElement('button');
    addOptionButton.id = 'add-option-button-' + questionId;
    addOptionButton.innerText = 'Cevap Seçeneği Ekle';
    addOptionButton.onclick = () => addAnswerOption(answerOptionsContainer, question);
    addOptionButton.style.display = 'none';
    questionDiv.appendChild(addOptionButton);

    // Zorunlu alan switch'i ve etiketi
    const mandatorySwitchContainer = document.createElement('div');
    mandatorySwitchContainer.className = 'mandatory-switch-container';
    const mandatorySwitchLabel = document.createElement('label');
    mandatorySwitchLabel.innerHTML = 'Zorunlu: ';
    mandatorySwitchLabel.htmlFor = 'mandatory-' + questionId;
    const mandatorySwitch = document.createElement('input');
    mandatorySwitch.type = 'checkbox';
    mandatorySwitch.id = 'mandatory-' + questionId;
    mandatorySwitch.className = 'mandatory-switch';
    mandatorySwitchContainer.appendChild(mandatorySwitchLabel);
    mandatorySwitchContainer.appendChild(mandatorySwitch);
    questionDiv.appendChild(mandatorySwitchContainer);

    // Soru nesnesine 'mandatory' özelliğini ekleyin
    question.mandatory = mandatorySwitch;

    // Resim yükleme butonu ve önizleme alanı
    const imageUploadInput = document.createElement('input');
    imageUploadInput.type = 'file';
    imageUploadInput.accept = 'image/*';
    imageUploadInput.style.display = 'none';
    imageUploadInput.onchange = (e) => handleImageUpload(e, questionDiv);

    const imageUploadLabel = document.createElement('label');
    imageUploadLabel.innerHTML = 'Resim Yükle';
    imageUploadLabel.className = 'custom-file-upload';
    imageUploadLabel.appendChild(imageUploadInput);

    const imagePreview = document.createElement('img');
    imagePreview.style.maxWidth = '100%';
    imagePreview.style.display = 'none';

    questionDiv.appendChild(imageUploadLabel);
    questionDiv.appendChild(imagePreview);
    createImageOptionsMenu(questionDiv);

    // Soru nesnesine 'image' özelliğini ekleyin
    question.image = imagePreview;

    // Soruyu questions dizisine ekle
    questions.push(question);

    // Soru bölümünü ana konteynere ekle
    questionContainer.appendChild(questionDiv);
}


function handleQuestionTypeChange(questionTypeSelect, questionDiv) {
    const answerOptionsContainer = questionDiv.querySelector('.answer-options-container');
    const addOptionButton = document.getElementById('add-option-button-' + questionDiv.id);

    answerOptionsContainer.innerHTML = '';

    switch (questionTypeSelect.value) {
        case 'Kısa Cevap':
        case 'Paragraf':
        case 'Tarih':
        case 'Zaman':
            addOptionButton.style.display = 'none';
            let inputType;
            switch (questionTypeSelect.value) {
                case 'Paragraf':
                    inputType = 'textarea';
                    break;
                case 'Tarih':
                    inputType = 'date';
                    break;
                case 'Zaman':
                    inputType = 'time';
                    break;
                default:
                    inputType = 'text';
            }
            const input = document.createElement(inputType === 'textarea' ? 'textarea' : 'input');
            if (inputType !== 'textarea') {
                input.type = inputType;
            }
            input.className = 'option-input';
            input.placeholder = questionTypeSelect.value === 'Paragraf' ? 'Paragraf yanıtı' : 'Kısa cevap';
            input.disabled = true; // Input alanını devre dışı bırak
            answerOptionsContainer.appendChild(input);
            break;
        default:
            addOptionButton.style.display = 'block';
            break;
    }
}

function createImageOptionsMenu(questionDiv) {
    // Menüyü oluştur
    const menu = document.createElement('div');
    menu.className = 'image-options-menu';
    //menu.style.display = 'none'; // Menüyü başlangıçta gizle
    // Menü içeriği


    // Menüyü açıp kapatan <buton></buton>
    const menuButton = document.createElement('div');
    menuButton.className = 'menu-button';
    menuButton.innerHTML = `

    <button class="menu-btn" onclick="changeImage('${questionDiv.id}')">Değiştir</button>
    <button class="menu-btn" onclick="removeImage('${questionDiv.id}')">Kaldır</button>
    `
    menuButton.onclick = (event) => {
        event.stopPropagation();
        closeAllOpenMenus(); // Diğer tüm menüleri kapat
        menu.classList.toggle('show');
        menu.style.left = event.clientX + 'px'; // Menünün X koordinatını ayarla
        menu.style.top = event.clientY + 'px'; // Menünün Y koordinatını ayarla
    };

    questionDiv.appendChild(menu);
    questionDiv.appendChild(menuButton);
}

// Diğer tüm açık menüleri kapat
function closeAllOpenMenus() {
    document.querySelectorAll('.image-options-menu.show').forEach(openMenu => {
        openMenu.classList.remove('show');
    });
}

function handleImageUpload(event, questionDiv) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const imagePreview = questionDiv.querySelector('img');
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block'; // Resmi göster
    };
    reader.readAsDataURL(file);
}

function addAnswerOption(container, question) {
    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.className = 'option-input';
    optionInput.placeholder = 'Cevap Seçeneği';
    container.appendChild(optionInput);

    // Seçeneği question objesinin answerOptions dizisine ekle
    question.answerOptions.push(optionInput);
}

// yüklenen resmin hizalanması 
function alignImage(questionDivId, alignment) {
    const questionDiv = document.getElementById(questionDivId);
    const image = questionDiv.querySelector('img');
    if (image) {
        image.style.float = alignment; // 'left', 'right', 'none' için
        image.style.margin = alignment === 'center' ? 'auto' : '0'; // Ortalama için
    }
}

// yüklenen resmin değiştirilmesi
function changeImage(questionDivId) {

    const questionDiv = document.getElementById(questionDivId);
    const imageUploadInput = questionDiv.querySelector('input[type="file"]');
    if (imageUploadInput) {
        imageUploadInput.click();
    }
}

// yüklenen resmin kaldırılması
function removeImage(questionDivId) {
    const questionDiv = document.getElementById(questionDivId);
    const image = questionDiv.querySelector('img');
    if (image) {
        image.remove(); // Resmi kaldır
    }
}


function submitForm() {
    const formTitle = document.getElementById('formTitle').value;
    const formDescription = document.getElementById('formDescription').value; // Form açıklamasını al
    const questionData = questions.map(q => ({
        question: q.questionInput.value,
        type: q.questionTypeSelect.value
        // Seçenekler eklenebilir
    }));

    // Form verilerini sunucuya gönder
    fetch('/createForm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: formTitle, description: formDescription, questions: questionData }) // Açıklamayı da gönder
    })
        .then(response => response.json())
        .then(data => {
            console.log('Form başarıyla gönderildi:', data);
            // Başarılı gönderimden sonra yapılacak işlemler
        })
        .catch((error) => {
            console.error('Hata:', error);
        });
}

function updateQuestionFont(font) {
    // Tüm soru inputlarının fontunu güncelle
    document.querySelectorAll('.question-block .question-input').forEach(el => el.style.fontFamily = font);
}

function updateTextFont(font) {
    // Tüm seçenek inputlarının fontunu güncelle
    document.querySelectorAll('.question-block .option-input').forEach(el => el.style.fontFamily = font);
}


function showPreview() {
    // Form başlığı ve açıklamasını al
    const formTitle = document.getElementById('formTitle').value;
    const formDescription = document.getElementById('formDescription').value;
    const headerImage = document.getElementById('form-header-image');

    // Ön izleme içeriğini oluştur
    const preview = document.getElementById('formPreview');
    let previewContent = `<h1 class="text-center" >${formTitle}</h1>`;

    // Anket başlığı için resim ekleme
    if (headerImage && headerImage.src) {
        previewContent += `<img src="${headerImage.src}" style="max-width: 100%; height: auto;"/>`;
    }

    previewContent += `<p>${formDescription}</p>`;

    // Soruları ve ilgili detayları ekle
    questions.forEach(q => {
        previewContent += `<div class='preview-question'><strong>Soru: ${q.questionInput.value}</strong></div>`;

        // Soruya ilişkin resmi ekleme
        if (q.image && q.image.src) {
            previewContent += `<img src="${q.image.src}" style="max-width: 100%; height: auto;"/>`;
        }

        // Soru tipine göre ek bilgileri ekle
        switch (q.questionTypeSelect.value) {
            case 'Çoktan Seçmeli':
                previewContent += '<ol type="A">';
                q.answerOptions.forEach(opt => {
                    previewContent += `<li><input type="radio" >${opt.value}</li>`;
                });
                previewContent += '</ol>';
                break;
            case 'Onay Kutusu':
                previewContent += '<ul>';
                q.answerOptions.forEach(opt => {
                    previewContent += `<li><input type="checkbox" >${opt.value}</li>`;
                });
                previewContent += '</ul>';
                break;
            case 'Açılır Liste':
                previewContent += '<select >';
                q.answerOptions.forEach(opt => {
                    previewContent += `<option>${opt.value}</option>`;
                });
                previewContent += '</select>';
                break;
            case 'Tarih':
                previewContent += `<p>Tarih Seçimi</p>`;
                break;
            case 'Zaman':
                previewContent += `<p>Zaman Seçimi</p>`;
                break;
            // Diğer soru tipleri için eklemeler yapılabilir
        }

        // Zorunlu alan bilgisi
        if (q.mandatory && q.mandatory.checked) {
            previewContent += `<p><em>Bu soru zorunludur.</em></p>`;
        }
    });

    preview.innerHTML = previewContent;
    document.getElementById('previewModal').style.display = 'block';
}



function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}



document.getElementById('header-image-upload').addEventListener('change', function (event) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const headerImage = document.getElementById('form-header-image');
        if (headerImage) {
            headerImage.src = e.target.result;
            headerImage.style.display = 'block';
        }
    };
    reader.readAsDataURL(event.target.files[0]);
});


document.getElementById('theme-color').addEventListener('input', function (event) {
    // Tematik rengi güncelleyin
    // Örnek: document.body.style.backgroundColor = event.target.value;
});
// Başlık Fontu için Dinleyici
// Başlık Fontu için Dinleyici

// Sayfa yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', function () {
    // Diğer dinleyiciler

    // Açıklama Fontu için Dinleyici
    document.getElementById('description-font-selector').addEventListener('change', function (event) {
        const selectedFont = event.target.value;
        document.querySelector('.form-description').style.fontFamily = selectedFont;
    });
});
document.getElementById('title-font-selector').addEventListener('change', function (event) {
    const selectedFont = event.target.value;
    document.querySelector('.form-title').style.fontFamily = selectedFont; // form başlığı için
});

// Soru Fontu için Dinleyici
document.getElementById('question-font-selector').addEventListener('change', function (event) {
    const selectedFont = event.target.value;
    // Yeni eklenen her soruya uygulamak için addQuestion fonksiyonunu değiştirin
    updateQuestionFont(selectedFont);
});

// Genel Metin Fontu için Dinleyici
document.getElementById('text-font-selector').addEventListener('change', function (event) {
    const selectedFont = event.target.value;
    // Soruların seçenekleri gibi metin alanlarına uygulamak için gerekli kod
    updateTextFont(selectedFont);
});
// Sayfanın herhangi bir yerine tıklandığında menüyü kapat
document.addEventListener('click', closeAllOpenMenus);




document.getElementById('theme-color').addEventListener('input', function (event) {
    // Seçilen rengi al
    const selectedColor = event.target.value;
    // Arka plan rengini güncelle
    document.querySelector('.form-builder-container').style.backgroundColor = selectedColor;
});
