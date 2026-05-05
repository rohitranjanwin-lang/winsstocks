function toggleFields() {
  const type = document.getElementById("type").value;
  document.getElementById("sip-fields").style.display = type === "sip" || type === "stepup" ? "block" : "none";
  document.getElementById("lumpsum-field").style.display = type === "lumpsum" ? "block" : "none";
  document.getElementById("stepup-field").style.display = type === "stepup" ? "block" : "none";
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

function calculate() {
  const type = document.getElementById("type").value;
  const rateInput = parseFloat(document.getElementById("rate").value);
  const years = parseFloat(document.getElementById("years").value);

  if (isNaN(rateInput) || isNaN(years)) {
    alert("Please fill all values.");
    return;
  }

  const rate = rateInput / 100 / 12;
  const n = years * 12;

  let invested = 0;
  let futureValue = 0;

  if (type === "sip") {
    const monthly = parseFloat(document.getElementById("monthly").value);
    if (isNaN(monthly)) {
      alert("Please enter monthly investment.");
      return;
    }
    invested = monthly * n;
    futureValue = monthly * ((Math.pow(1 + rate, n) - 1) / rate) * (1 + rate);

  } else if (type === "stepup") {
    let monthly = parseFloat(document.getElementById("monthly").value);
    const stepupPercent = parseFloat(document.getElementById("stepupPercent").value);

    if (isNaN(monthly) || isNaN(stepupPercent)) {
      alert("Please enter both monthly investment and step-up %.");
      return;
    }

    for (let year = 1; year <= years; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthsLeft = (years * 12) - ((year - 1) * 12 + (month - 1));
        futureValue += monthly * Math.pow(1 + rate, monthsLeft);
        invested += monthly;
      }
      monthly *= (1 + stepupPercent / 100); // Increase monthly by step-up % each year
    }

  } else if (type === "lumpsum") {
    const lumpsum = parseFloat(document.getElementById("lumpsum").value);
    if (isNaN(lumpsum)) {
      alert("Please enter lumpsum investment.");
      return;
    }
    invested = lumpsum;
    futureValue = lumpsum * Math.pow(1 + rate, n);
  }

  const gain = futureValue - invested;

  const result = `
    <div style="padding: 20px; background: #f4f8fb; border-radius: 8px;">
      <p><strong>Total Invested:</strong> ${formatCurrency(invested)}</p>
      <p><strong>Future Value:</strong> ${formatCurrency(futureValue)}</p>
      <p><strong>Total Gain:</strong> ${formatCurrency(gain)}</p>
    </div>
  `;

  document.getElementById("sip-result").innerHTML = result;
}
