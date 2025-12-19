
document.addEventListener('DOMContentLoaded', () => {
    const gradeMap = {
      'O': 10,
      'A+': 9,
      'A': 8,
      'B+': 7,
      'B': 6,
      'C': 5,
      'RA': 0,
      'SA': 0
    };
    const subjectList = document.getElementById('subjectList');
    const addBtn = document.getElementById('addBtn');
    const calcBtn = document.getElementById('calcBtn');
    const resetBtn = document.getElementById('resetBtn');
  
    const sgpaDisplay = document.getElementById('sgpaDisplay');
    const percentDisplay = document.getElementById('percentDisplay');
    const totalCreditsEl = document.getElementById('totalCredits');
    const motivationEl = document.getElementById('motivation');
    const required = { subjectList, addBtn, calcBtn, resetBtn, sgpaDisplay, percentDisplay, totalCreditsEl, motivationEl };
    for (const [k,v] of Object.entries(required)) {
      if (!v) {
        console.error(`Cgpia: required DOM element not found -> ${k}. Check your index.html has the element with the exact id.`);
        if (document.body) {
          const warn = document.createElement('div');
          warn.style.color = 'orange';
          warn.style.padding = '12px';
          warn.style.margin = '12px';
          warn.style.background = 'rgba(255,165,0,0.06)';
          warn.textContent = `Cgpia: JS couldn't find '${k}'. Open devtools console for details.`;
          document.body.prepend(warn);
        }
        return;
      }
    }
    function createSubjectRow(name = '', credit = 3, grade = 'O') {
      const row = document.createElement('div');
      row.className = 'subject-row';

      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.placeholder = 'Subject name';
      nameInput.value = name;

      const creditInput = document.createElement('input');
      creditInput.type = 'number';
      creditInput.min = 1;
      creditInput.value = credit;
  

      const gradeSelect = document.createElement('select');
      for (const g of Object.keys(gradeMap)) {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        if (g === grade) opt.selected = true;
        gradeSelect.appendChild(opt);
      }
  

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove';
      removeBtn.type = 'button';
      removeBtn.textContent = 'X';
      removeBtn.onclick = () => row.remove();
  
      row.appendChild(nameInput);
      row.appendChild(creditInput);
      row.appendChild(gradeSelect);
      row.appendChild(removeBtn);
  
      return row;
    }
    function init() {
      subjectList.innerHTML = ''; // clear
      subjectList.appendChild(createSubjectRow('Maths', 3, 'A'));
      subjectList.appendChild(createSubjectRow('Java', 3, 'B'));
      // reset display
      sgpaDisplay.textContent = '—';
      percentDisplay.textContent = '—';
      totalCreditsEl.textContent = '0';
      motivationEl.style.display = 'none';
    }
  
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      subjectList.appendChild(createSubjectRow());
    });
  
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      init();
    });
  
    calcBtn.addEventListener('click', (e) => {
      e.preventDefault();
  
      const rows = subjectList.querySelectorAll('.subject-row');
      if (rows.length === 0) {
        alert('Add at least one subject before calculating.');
        return;
      }
  
      let totalCredits = 0;
      let totalPoints = 0;
  
      rows.forEach(row => {
        const inputs = row.querySelectorAll('input, select');
        const nameInput = row.querySelector('input[type="text"]');
        const creditInput = row.querySelector('input[type="number"]');
        const gradeSelect = row.querySelector('select');
  
        const credit = Number(creditInput?.value) || 0;
        const grade = (gradeSelect?.value) || 'RA';
  
        totalCredits += credit;
        const gp = gradeMap[grade] !== undefined ? gradeMap[grade] : 0;
        totalPoints += gp * credit;
      });
  
      if (totalCredits === 0) {
        alert('Total credits is zero. Please enter valid credit values (>=1).');
        return;
      }
  
      const sgpa = totalPoints / totalCredits;
      const sgpaRounded = Math.round(sgpa * 100) / 100;
      const percent = Math.round(((sgpaRounded - 0.5) * 10) * 10) / 10;
      sgpaDisplay.textContent = sgpaRounded.toFixed(2);
      percentDisplay.textContent = percent.toFixed(1) + '%';
      totalCreditsEl.textContent = totalCredits;
      let msg = "Nice effort — keep pushing!";
      if (sgpaRounded >= 9) msg = 'Outstanding! Keep it up 🔥';
      else if (sgpaRounded >= 8) msg = 'Great job — you are doing very well 🌟';
      else if (sgpaRounded >= 7) msg = 'Good work — a little more focus will help 💪';
      else if (sgpaRounded >= 6) msg = 'You are getting there — revise with a plan 📚';
      else msg = "Don't be discouraged — steady steps will improve your score 💡";
  
      motivationEl.textContent = msg;
      motivationEl.style.display = 'block';
    });
    init();
  });