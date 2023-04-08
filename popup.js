const btn = document.querySelector('#action'),
    presentation = document.querySelector('#presentation'),
    searcher = document.querySelector('#searcher'),
    loader = document.querySelector('#loader');

btn.addEventListener('click', async () => {
    loadCompanies();
});

async function loadCompanies() {
    if (searcher.value == null || searcher.value === '') return

    loading(true);
    try {
        btn.setAttribute('disabled', 'disabled');
        presentation.innerHTML = '';
        let url = createURLQuery(searcher.value);
        const page = await fetch(`http://localhost:3000/companies?url=${encodeURIComponent(url)}`);
        const companies = await page.json();
        loading(false);
        if (!companies.result) {
            return presentation.innerHTML = `<p class="text-danger">${companies.message}</p>`;
        }

        for (let company of companies.result) {
            presentation.appendChild(createCompanyItemCard(company));
        }
    } catch(e) {
        loading(false);
        presentation.innerHTML = `<div class="error-msg">
            Sorry, something went wrong :(
        </div>`;
    } finally {
        btn.removeAttribute('disabled');
    }

}

async function loadCompany(companyURL) {
    loading(true);
    try {
        presentation.innerHTML = '';
        const page = await fetch(`http://localhost:3000/company?url=${encodeURIComponent(companyURL)}`);
        const company = await page.json();
        loading(false);
        if (!company.result) {
            return presentation.innerHTML = `<p class="text-danger">${companies.message}</p>`;
        }
        createCompanyInformationCard(company.result);
    }  catch(e) {
        loading(false);
        console.error(e);
        presentation.innerHTML = `<div class="error-msg">
            Sorry, something went wrong :(
        </div>`;
    }
}

function createCompanyItemCard(company) {
    const div = document.createElement('div');
    div.className = 'company-card';
    const h6 = document.createElement('h6');
    h6.className = 'company-title-header';
    h6.textContent = company.companyName;
    h6.addEventListener('click', () => {
        loadCompany(company.companyHref);
    });
    const span = document.createElement('span');
    span.className = 'company-subheader';
    const a = document.createElement('a');
    const p = document.createElement('p');
    const status = document.createElement('p');
    status.className = company.status;
    p.textContent = company.location;
    a.href = company.googleLocation;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" />
        </svg>`

    span.appendChild(p);
    span.appendChild(a);
    span.appendChild(status);
    div.appendChild(h6);
    div.appendChild(span);

    return div;
}

function createCompanyInformationCard(company) {

    const div = document.createElement('div');

    const h4 = document.createElement('h4');
    h4.textContent = company?.legalName || company?.companyName;
    const h6 = document.createElement('h6');
    h6.textContent = `RNC - ${(company?.RNC || '')}`;

    const section = document.createElement('section');

    for(let [label, content] of company.dataset) {
        const span = document.createElement('span');
        span.textContent = content;
        span.className = `${label} spanlabel`;
        section.appendChild(span);
    }

    
    div.appendChild(h4);
    if(company?.RNC) div.appendChild(h6);
    div.appendChild(section);
    presentation.appendChild(div);
}

function createURLQuery(query) {
    const URLSearch = new URLSearchParams();
    URLSearch.append('utf8', '✓');
    URLSearch.append('q', query);

    return 'https://opencorporates.com/companies/do?' + URLSearch.toString();
}

function loading(state) {
    loader.style.display = state ? 'flex' : 'none';
}
