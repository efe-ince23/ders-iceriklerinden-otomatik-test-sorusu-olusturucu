import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { ArrowRight, BookOpen, Check, FileText, GraduationCap, Sparkles, UploadCloud, X } from 'lucide-react'

const acceptedExtensions = ['.pdf', '.docx', '.pptx']

function App() {
  // Form verileri: seçilen dosya, soru sayısı, zorluk ve kullanıcıya gösterilen mesaj.
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [count, setCount] = useState(10)
  const [level, setLevel] = useState('Orta')
  const [notice, setNotice] = useState('')
  const [dragging, setDragging] = useState(false)

  // Uzantı kontrolü, yalnızca istenen üç dosya türünün seçilmesini sağlar.
  const setValidFile = (nextFile?: File) => {
    if (!nextFile) return
    const extension = `.${nextFile.name.split('.').pop()?.toLowerCase()}`
    if (!acceptedExtensions.includes(extension)) {
      setNotice('Lütfen PDF, DOCX veya PPTX biçiminde bir dosya seçin.')
      return
    }
    setFile(nextFile)
    setNotice('')
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setValidFile(event.target.files?.[0])
  // Sürükle-bırak alanına bırakılan dosyayı da aynı uzantı kontrolünden geçirir.
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    setValidFile(event.dataTransfer.files[0])
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#baslangic" aria-label="Başlangıç sayfası">
          <span className="brand-mark"><BookOpen size={21} strokeWidth={2.2} /></span>
          <span className="brand-name">Ders<span>matik</span></span>
        </a>
        <div className="topbar-note"><span className="status-dot" /> Öğrenmeyi kolaylaştırır</div>
      </header>

      <section className="hero" id="baslangic">
        <div className="eyebrow"><Sparkles size={14} /> DERS İÇERİKLERİNDEN AKILLI SORULAR</div>
        <h1>Ders notlarından<br /><span>iyi sorular</span> çıkarın.</h1>
        <p className="hero-copy">Ders materyalinizi yükleyin, sınavınıza uygun çoktan seçmeli sorular hazırlamaya başlayın.</p>
      </section>

      <section className="workspace" aria-label="Soru oluşturma formu">
        <div className="form-heading">
          <div className="heading-icon"><GraduationCap size={22} /></div>
          <div><h2>Yeni soru seti</h2><p>Başlamak için ders materyalinizi ekleyin.</p></div>
          <span className="step-label">01 <i /> 02</span>
        </div>

        <div className="field-label"><span>Ders materyali</span><span className="required">Gerekli</span></div>
        <div
          className={`dropzone ${dragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="file-selected">
              <span className="file-icon"><FileText size={22} /></span>
              <span className="file-info"><strong>{file.name}</strong><small>{(file.size / (1024 * 1024)).toFixed(2)} MB · Yüklemeye hazır</small></span>
              <button className="remove-file" type="button" aria-label="Dosyayı kaldır" onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = '' }}><X size={18} /></button>
            </div>
          ) : (
            <>
              <div className="upload-icon"><UploadCloud size={25} strokeWidth={1.8} /></div>
              <div className="upload-copy"><strong>Dosyanızı buraya bırakın</strong><span>veya bilgisayarınızdan seçin</span></div>
              <button className="choose-button" type="button" onClick={() => inputRef.current?.click()}>Dosya Seç <ArrowRight size={15} /></button>
            </>
          )}
          <input ref={inputRef} type="file" accept=".pdf,.docx,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={handleChange} hidden />
        </div>
        <div className="file-hint"><span>Desteklenen dosya türleri</span><div className="file-types"><span>PDF</span><span>DOCX</span><span>PPTX</span></div><span className="size-hint">En fazla 20 MB</span></div>

        <div className="divider" />
        <div className="options-grid">
          <fieldset className="option-group">
            <legend>Soru sayısı</legend>
            <div className="segmented">
              {[5, 10, 15, 20].map((n) => <button type="button" key={n} className={count === n ? 'active' : ''} aria-pressed={count === n} onClick={() => setCount(n)}>{n}</button>)}
            </div>
          </fieldset>
          <fieldset className="option-group">
            <legend>Zorluk seviyesi</legend>
            <div className="segmented level-select">
              {['Kolay', 'Orta', 'Zor'].map((item) => <button type="button" key={item} className={level === item ? 'active' : ''} aria-pressed={level === item} onClick={() => setLevel(item)}>{item}</button>)}
            </div>
          </fieldset>
        </div>

        {/* Gerçek soru üretimi bağlı değil; şimdilik kullanıcıya bilgilendirme gösterir. */}
        <button className="create-button" type="button" onClick={() => setNotice(file ? 'Soru oluşturma özelliği henüz sisteme bağlanmadı. Bu özellik hazır olduğunda ders materyalinizden sorular oluşturabileceksiniz.' : 'Devam etmek için önce bir ders materyali seçin.')}>
          <Sparkles size={17} /> Soru Oluştur <span className="button-detail">{count} soru · {level.toLocaleLowerCase('tr-TR')}</span> <ArrowRight className="button-arrow" size={18} />
        </button>
        {notice && <div className={`notice ${notice.startsWith('Lütfen') ? 'error' : ''}`} role="status"><span className="notice-check"><Check size={15} /></span>{notice}</div>}
        <p className="privacy-note">Dosyanız güvenliğiniz için bu örnek sayfada sunucuya gönderilmez.</p>
      </section>
      <footer>Öğrenmenin daha iyi bir yolu. <span>© 2026 Dersmatik</span></footer>
    </main>
  )
}

export default App
