let sehirler = [];
let endustriler = [];
let pozisyonlar = [];
let departmanlar = [];


// Şehirlerin hazırlanması
function sehirleriYukle() {
    fetch('cities.json')
        .then(response => response.json())
        .then(data => {
            sehirler = data;
        })
        .catch(error => console.error('Hata:', error));
}

function sehirAramayiBaslat() {
    document.getElementById('sehirArama').addEventListener('input', function(e) {
        const aramaTerimi = e.target.value.toLowerCase();
        let sonuclar = sehirler.filter(sehir => sehir.name.toLowerCase().startsWith(aramaTerimi));
        sonuclariGoster(sonuclar);
    });
}

function sonuclariGoster(sonuclar) {
    const sonucDivi = document.getElementById('sehirSonuclari');
    sonucDivi.innerHTML = ''; // Önceki sonuçları temizle

    sonuclar.forEach(sehir => {
        const sehirDiv = document.createElement('div');
        sehirDiv.textContent = `${sehir.name}, ${sehir.country}`; // Şehir adı ve ülke kodunu göster
        sehirDiv.addEventListener('click', function() {
            // Metin kutusuna şehir adı ve ülke kodunu yaz
            document.getElementById('sehirArama').value = `${sehir.name}, ${sehir.country}`;
            sonucDivi.innerHTML = ''; // Sonuçları temizle
        });
        sonucDivi.appendChild(sehirDiv);
    });
}


function yatirimDetaylariniGoster() {
    var yatirimYapildiMi = document.querySelector('input[name="yatirimYapildiMi"]:checked').value;
    var yatirimTutariSorusu = document.getElementById('yatirimTutariSorusu');

    if (yatirimYapildiMi === 'evet') {
        yatirimTutariSorusu.style.display = 'block';
    } else {
        yatirimTutariSorusu.style.display = 'none';
    }
}

///////////////////////////////
// endustry leri yükleme ve listeleme fonksiyonları
// ana kategori seçimi sonrası bağımlı olarak yanda 
// alt kategori'ye ait özel liste hazırlanıyor ve 
// kullanıcı buna göre ayrıca alt kategori seçimi yapıyor.

function endustrileriYukle() {
    fetch('endustry.json')
        .then(response => response.json())
        .then(data => {
            endustriler = data;
            endustriSecenekleriniDoldur();
        })
        .catch(error => console.error('Hata:', error));
}

function endustriSecenekleriniDoldur() {
    const endustriSelect = document.getElementById('endustriSecimi');
    endustriler.forEach(endustri => {
        const option = document.createElement('option');
        option.value = endustri.kategori;
        option.textContent = endustri.kategori;
        endustriSelect.appendChild(option);
    });
}

function altKategorileriDoldur(kategori) {
    const secilenEndustri = endustriler.find(endustri => endustri.kategori === kategori);
    const altKategoriSelect = document.getElementById('altKategoriSecimi');
    altKategoriSelect.innerHTML = ''; // Önceki seçenekleri temizle
    if (secilenEndustri) {
        secilenEndustri.altKategoriler.forEach(altKategori => {
            const option = document.createElement('option');
            option.value = altKategori;
            option.textContent = altKategori;
            altKategoriSelect.appendChild(option);
        });
    }
}

// ekip arkadaşı ekleme 
function ekipArkadasiEkle() {
    var ekipListesi = document.getElementById('ekipListesi');
    var ekipDiv = document.createElement('div');
    ekipDiv.className = 'ekipArkadasi';

    var yeniIsimInput = document.createElement('input');
    yeniIsimInput.setAttribute('type', 'text');
    yeniIsimInput.setAttribute('name', 'ekipArkadasiIsim[]');
    yeniIsimInput.setAttribute('placeholder', 'İsim-Soyisim');

    var yeniLinkedInInput = document.createElement('input');
    yeniLinkedInInput.setAttribute('type', 'url');
    yeniLinkedInInput.setAttribute('name', 'ekipArkadasiLinkedIn[]');
    yeniLinkedInInput.setAttribute('placeholder', 'LinkedIn Profili');
    yeniLinkedInInput.addEventListener('blur', linkedInDogrula);
    // Departman seçimi için açılır liste
    var yeniDepartmanSelect = document.createElement('select');
        yeniDepartmanSelect.setAttribute('name', 'ekipArkadasiDepartman[]');
        departmanlar.forEach(departman => {
        var option = document.createElement('option');
        option.value = departman.departman;
        option.textContent = departman.departman;
        yeniDepartmanSelect.appendChild(option);
    });

    // Pozisyon seçimi için açılır liste
    var yeniPozisyonSelect = document.createElement('select');
        yeniPozisyonSelect.setAttribute('name', 'ekipArkadasiPozisyon[]');
        pozisyonlar.forEach(pozisyon => {
        var option = document.createElement('option');
        option.value = pozisyon.pozisyon;
        option.textContent = pozisyon.pozisyon;
        yeniPozisyonSelect.appendChild(option);
    });



    ekipDiv.appendChild(yeniIsimInput);
    ekipDiv.appendChild(yeniLinkedInInput);
    ekipDiv.appendChild(yeniDepartmanSelect);
    ekipDiv.appendChild(yeniPozisyonSelect);

    ekipListesi.appendChild(ekipDiv);
}

function finansmanTurleriniDoldur() {
    var finansmanTurleri = ["Ön-Tohum", "Tohum", "A Serisi", "B Serisi", "C Serisi", "D Serisi", "E Serisi", "F Serisi", "G Serisi", "H Serisi", "Seri I", "J Serisi", "Melek", "Özel Sermaye", "Borç Finansmanı", "Bağış", "Kurumsal Tur", "Özkaynak Kitle Fonlaması", "Ürün Kitle Fonlaması", "İkincil Pazar", "Halka arz sonrası özkaynak", "Halka arz sonrası borç", "Halka arz sonrası ikincil","Eşit Olmayan Yardım", "İlk Coin Teklifi (??)","Açıklanmayan"];
    var finansmanTuruSelect = document.getElementById('sonFinansmanTuru');
    finansmanTurleri.forEach(function(tur) {
        var option = document.createElement('option');
        option.value = tur;
        option.textContent = tur;
        finansmanTuruSelect.appendChild(option);
    });
}

function yeniYatirimciEkle() {
    var yatirimcilarDiv = document.getElementById('yatirimcilar');
    var yeniInput = document.createElement('input');
    yeniInput.setAttribute('type', 'text');
    yeniInput.setAttribute('name', 'yatirimci[]');
    yeniInput.setAttribute('placeholder', 'Yatırımcı İsmi');
    yatirimcilarDiv.appendChild(yeniInput);
}



document.addEventListener('DOMContentLoaded', function() {
    sehirleriYukle();
    sehirAramayiBaslat();
    endustrileriYukle();
    verileriYukle();
    document.getElementById('endustriSecimi').addEventListener('change', function(e) {
        altKategorileriDoldur(e.target.value);
    });
    document.getElementById('finansmanEvet').addEventListener('change', function() {
        document.getElementById('finansmanDetaylari').style.display = 'block';
        finansmanTurleriniDoldur();
    });

    document.getElementById('finansmanHayir').addEventListener('change', function() {
        document.getElementById('finansmanDetaylari').style.display = 'none';
    });
     // Şirketleşme durumu için event listener ekleyin
     document.getElementById('sirketEvet').addEventListener('change', function() {
        document.getElementById('sirketEvetDetaylari').style.display = 'block';
    });

    document.getElementById('sirketHayir').addEventListener('change', function() {
        document.getElementById('sirketEvetDetaylari').style.display = 'none';
    });
});

// logo yükleme alanı

function previewLogo(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('logoPreview').src = e.target.result;
            document.getElementById('logoPreview').style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}



function linkedInDogrula(event) {
    var linkedInURL = event.target.value;
    if (linkedInURL && !linkedInURL.match(/^https:\/\/[a-z]{2,3}\.linkedin\.com\/.*$/)) {
        alert('Lütfen geçerli bir LinkedIn URL girin.');
        event.target.focus();
    }
}

function verileriYukle() {
    // Pozisyonlar için JSON dosyasını yükle
    fetch('position.json')
        .then(response => response.json())
        .then(data => {
            pozisyonlar = data;
            console.log("Yüklenen pozisyonlar:", pozisyonlar); // Yüklenen pozisyonları konsolda göster
        })
        .catch(error => console.error('Hata:', error));

    // Departmanlar için JSON dosyasını yükle
    fetch('department.json')
        .then(response => response.json())
        .then(data => {
            departmanlar = data;
            console.log("Yüklenen departmanlar:", departmanlar); // Yüklenen departmanları konsolda göster
        })
        .catch(error => console.error('Hata:', error));
}



function sosyalMedyaEkle() {
    var sosyalMedyaListesi = document.getElementById('sosyalMedyaListesi');
    var yeniInput = document.createElement('input');
    yeniInput.setAttribute('type', 'url');
    yeniInput.setAttribute('name', 'sosyalMedya[]');
    yeniInput.setAttribute('placeholder', 'Sosyal Medya Linki');
    sosyalMedyaListesi.appendChild(yeniInput);
}






document.getElementById('logoUpload').addEventListener('change', function(e){
    var reader = new FileReader();
    reader.onload = function(){
        var img = document.getElementById('logoPreview');
        img.src = reader.result;
        img.style.display = 'block';
    };
    reader.readAsDataURL(e.target.files[0]);
});

// mentor.json'dan seçenekleri yükleme
function mentorlukSecenekleriniYukle() {
    fetch('mentor.json')
        .then(response => response.json())
        .then(data => {
            data.mentor_keys.forEach(mentorKey => {
                for (let i = 1; i <= 3; i++) {
                    let option = new Option(mentorKey, mentorKey.toLowerCase().replace(/\s+/g, ''));
                    document.getElementById(`mentorlukSecimi${i}`).appendChild(option);
                }
            });
        });
}

// Seçimleri güncelleme
function mentorlukSecimiGuncelle() {
    let secilenler = [];
    for (let i = 1; i <= 3; i++) {
        let secim = document.getElementById(`mentorlukSecimi${i}`).value;
        if (secim) secilenler.push(secim);
    }

    document.getElementById('secilenMentorluklar').textContent = "Seçilen Alanlar: " + secilenler.join(', ');
}

// Event Listener'ları ayarlama
document.addEventListener('DOMContentLoaded', mentorlukSecenekleriniYukle);
for (let i = 1; i <= 3; i++) {
    document.getElementById(`mentorlukSecimi${i}`).addEventListener('change', mentorlukSecimiGuncelle);
}

