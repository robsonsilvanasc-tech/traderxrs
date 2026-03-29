// ===== SISTEMA DE PAGAMENTO PIX (COM ANTI-AGENDAMENTO) =====
var whatsappNumero = '5511913198847';

var planos = {
    starter: {
        nome: 'Starter',
        valor: 'R$ 97,00',
        pix: '00020101021126610014br.gov.bcb.pix0114+55119131988470221SEGUE O GERENCIAMENTO520400005303986540597.005802BR5922ROBSON S DO NASCIMENTO6010UBERLANDIA62070503***63049977'
    },
    professional: {
        nome: 'Professional',
        valor: 'R$ 197,00',
        pix: '00020101021126600014br.gov.bcb.pix0114+55119131988470220SIGA O GERENCIAMENTO5204000053039865406197.005802BR5922ROBSON S DO NASCIMENTO6010UBERLANDIA62070503***63049E6B'
    },
    elite: {
        nome: 'Elite',
        valor: 'R$ 497,00',
        pix: '00020101021126600014br.gov.bcb.pix0114+55119131988470220SIGA O GERENCIAMENTO5204000053039865406497.005802BR5922ROBSON S DO NASCIMENTO6010UBERLANDIA62070503***6304D103'
    }
};

function copiarPix(planoId) {
    if (!window.Swal) {
        console.error('SweetAlert2 não carregou — verifique CDN/script.');
        alert('Ocorreu um erro ao carregar o sistema de mensagens. Recarregue a página.');
        return;
    }
    var plano = planos[planoId];
    if (!plano || !plano.pix) {
        console.error('Plano ou Pix não encontrado:', planoId);
        Swal.fire({ icon: 'error', title: 'Erro', text: 'Opção de pagamento inválida. Recarregue a página.' });
        return;
    }

    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
    if (!isSecure) {
        console.warn('Clipboard pode estar bloqueado porque não está em https (ou localhost). Atual URL:', location.href);
    }

    if (!navigator.clipboard) {
        console.warn('navigator.clipboard não disponível neste navegador.');
        mostrarModalManual(plano);
        return;
    }

    try {
        navigator.clipboard.writeText(plano.pix)
            .then(() => {
                console.info('Pix copiado automaticamente para o plano:', plano.nome);
                mostrarModalSucesso(plano);
            })
            .catch(err => {
                console.warn('Falha ao copiar com clipboard API:', err);
                mostrarModalManual(plano);
            });
    } catch (e) {
        console.error('Exceção ao chamar clipboard.writeText:', e);
        mostrarModalManual(plano);
    }
}

function mostrarModalSucesso(plano) {
    Swal.fire({
        icon: 'success',
        title: 'PIX Copiado! ✅',
        html: `
            <div style="text-align:left; font-size: 14px;">
                <p>O código Pix do plano <b>${plano.nome}</b> foi copiado para a área de transferência.</p>
                <hr style="margin: 10px 0;">
                <p>👇 <b>PRÓXIMOS PASSOS IMPORTANTES:</b></p>
                <ol style="line-height: 1.8; margin-left: 15px;">
                    <li><b style="color:#e74c3c">⚠️ NÃO AGENDE O PIX!</b> Faça o pagamento <b>AGORA</b> para garantir sua vaga imediata.</li>
                    <li>Abra o App do seu banco.</li>
                    <li>Escolha <b>PIX Copia e Cola</b>.</li>
                    <li>Cole o código e confirme o pagamento <b>IMEDIATAMENTE</b>.</li>
                    <li>Volte aqui e clique no botão verde abaixo para enviar o comprovante.</li>
                </ol>
                <div style="background: #e74c3c20; border: 1px solid #e74c3c; padding: 10px; border-radius: 8px; margin-top: 15px;">
                    <p style="margin:0; font-size:13px; color:#e74c3c;"><b>❗ PIX AGENDADO NÃO É VALIDADO</b><br>Somente pagamentos imediatos liberam o acesso ao grupo VIP.</p>
                </div>
            </div>
        `,
        confirmButtonText: '📲 Enviar Comprovante no WhatsApp',
        confirmButtonColor: '#25D366',
        showCancelButton: true,
        cancelButtonText: 'Fechar'
    }).then((result) => {
        if (result.isConfirmed) {
            irParaWhatsApp(plano);
        }
    });
}

function mostrarModalManual(plano) {
    Swal.fire({
        icon: 'info',
        title: 'Copie o código abaixo',
        html: `
            <p style="margin-bottom:10px;">Não conseguimos copiar automático. Por favor, copie o código abaixo e depois envie o comprovante:</p>
            <textarea id="pixArea" readonly style="width:100%; height:90px; font-size:12px; border:1px solid #ccc; border-radius:5px; padding:5px; resize:none;">${plano.pix}</textarea>
            <div style="background: #e74c3c20; border: 1px solid #e74c3c; padding: 10px; border-radius: 8px; margin-top: 15px;">
                <p style="margin:0; font-size:13px; color:#e74c3c;"><b>⚠️ IMPORTANTE: NÃO AGENDE O PIX!</b><br>Faça o pagamento imediato para garantir seu acesso.</p>
            </div>
            <div style="margin-top:12px;">
                <button id="btnCopiarManual" style="width:100%; padding:10px; border-radius:5px; background:#25D366; color:#fff; border:0; cursor:pointer;">📋 Copiar Código Manualmente</button>
            </div>
        `,
        confirmButtonText: 'Já Enviei! Ir para WhatsApp',
        confirmButtonColor: '#25D366',
        showCancelButton: true,
        cancelButtonText: 'Fechar',
        didOpen: () => {
            const input = document.getElementById('pixArea');
            input.focus();
            input.select();
            document.getElementById('btnCopiarManual').onclick = () => {
                input.select();
                document.execCommand('copy');
                Swal.fire({ icon: 'success', title: 'Copiado!', text: 'Agora cole no seu banco e pague IMEDIATAMENTE.' });
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            irParaWhatsApp(plano);
        }
    });
}

function irParaWhatsApp(plano) {
    const mensagem = `Olá! Fiz o PIX do plano *${plano.nome}* no valor de *${plano.valor}*. Segue o comprovante!`;
    window.open(`https://wa.me/${whatsappNumero}?text=${encodeURIComponent(mensagem)}`, '_blank');
}
// ===== FIM DO SISTEMA DE PAGAMENTO PIX =====

// Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 1500);
});

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// Scroll to top
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Fade in on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Count up
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'));
            if (!target) return;
            let current = 0;
            const increment = target / 80;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target.toLocaleString('pt-BR');
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current).toLocaleString('pt-BR');
                }
            }, 20);
            countObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

// Chart buttons
document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Simulate price updates
function updatePrices() {
    document.querySelectorAll('.market-row').forEach(row => {
        const priceEl = row.querySelector('.price');
        if (!priceEl) return;
        const text = priceEl.textContent;
        const num = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (isNaN(num)) return;
        const change = (Math.random() - 0.48) * num * 0.002;
        const newNum = num + change;
        if (text.includes('R$')) {
            priceEl.textContent = 'R$ ' + newNum.toFixed(2);
        } else if (text.includes('$')) {
            priceEl.textContent = '$' + newNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
            priceEl.textContent = Math.round(newNum).toLocaleString('pt-BR');
        }
        priceEl.style.color = change >= 0 ? 'var(--green)' : 'var(--red)';
        setTimeout(() => { priceEl.style.color = '#fff'; }, 500);
    });
}
setInterval(updatePrices, 3000);

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
