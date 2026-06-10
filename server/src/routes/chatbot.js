const express = require('express');
const router = express.Router();
const { Employee, PayRun, Leave, Loan, Reimbursement } = require('../models');

// POST /api/chatbot
router.post('/', async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required.' });

    const lowerMsg = message.toLowerCase().trim();
    let reply = '';

    // Fetch data needed for answering
    const allEmployees = await Employee.find({ status: 'Active' });
    const allLeaves = await Leave.find();
    const allLoans = await Loan.find();
    const allPayRuns = await PayRun.find().sort({ createdAt: -1 });

    // ─── Employee-specific queries ─────────────────────────
    // "What is [name]'s net pay?" / "net pay of [name]"
    const netPayMatch = lowerMsg.match(/(?:what\s+is\s+|net\s+pay\s+(?:of|for)\s+)([a-z]+(?:\s+[a-z]+)?)\S*\s*(?:'s\s+)?(?:net\s*pay|salary)?/i);
    const nameSearchTerms = lowerMsg.match(/(?:net\s*pay|salary|pay|ctc|earning).*?(?:of|for)\s+([a-z]+)/i)
      || lowerMsg.match(/([a-z]+)(?:'s)\s+(?:net\s*pay|salary|pay|ctc|earning)/i);

    if (netPayMatch || nameSearchTerms) {
      const searchName = (netPayMatch ? netPayMatch[1] : nameSearchTerms[1]).toLowerCase().trim();
      const matchedEmp = allEmployees.find(e =>
        e.firstName.toLowerCase() === searchName ||
        e.lastName.toLowerCase() === searchName ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchName)
      );

      if (matchedEmp) {
        const monthlyCTC = Math.round((matchedEmp.salary.ctc || 0) / 12);
        const monthlyBasic = Math.round((matchedEmp.salary.basic || 0) / 12);
        const epf = Math.round(monthlyBasic * 0.12);
        const esi = monthlyCTC <= 21000 ? Math.round(monthlyCTC * 0.0075) : 0;
        const pt = 200;
        const netPay = monthlyCTC - epf - esi - pt;

        reply = `💰 **${matchedEmp.firstName} ${matchedEmp.lastName}**'s monthly salary breakdown:\n\n` +
          `• **Monthly CTC:** ₹${monthlyCTC.toLocaleString('en-IN')}\n` +
          `• **Basic:** ₹${monthlyBasic.toLocaleString('en-IN')}\n` +
          `• **EPF Deduction:** ₹${epf.toLocaleString('en-IN')}\n` +
          `• **ESI:** ₹${esi.toLocaleString('en-IN')}\n` +
          `• **Professional Tax:** ₹${pt.toLocaleString('en-IN')}\n` +
          `• **Net Pay:** ₹${netPay.toLocaleString('en-IN')}\n\n` +
          `Department: ${matchedEmp.department} | Designation: ${matchedEmp.designation}`;
      } else {
        reply = `❌ I couldn't find an employee named "${searchName}". Please check the name and try again.`;
      }
    }

    // ─── Leave queries ─────────────────────────────────────
    else if (lowerMsg.includes('pending leave') || lowerMsg.includes('leave pending') || lowerMsg.includes('leaves pending') || lowerMsg.includes('how many leaves')) {
      const pendingLeaves = allLeaves.filter(l => l.status === 'Pending');
      if (pendingLeaves.length === 0) {
        reply = '✅ There are no pending leave requests at this time. All caught up!';
      } else {
        reply = `📋 There are **${pendingLeaves.length}** pending leave request(s):\n\n`;
        pendingLeaves.slice(0, 5).forEach((l, i) => {
          reply += `${i + 1}. **${l.employeeName}** — ${l.type} (${l.days} day${l.days > 1 ? 's' : ''}) — ${l.reason}\n`;
        });
        if (pendingLeaves.length > 5) {
          reply += `\n...and ${pendingLeaves.length - 5} more.`;
        }
      }
    }

    // ─── Leave balance for specific employee ───────────────
    else if (lowerMsg.match(/leave\s*balance.*?(?:of|for)\s+([a-z]+)/i) || lowerMsg.match(/([a-z]+)(?:'s)\s+leave\s*balance/i)) {
      const lbMatch = lowerMsg.match(/leave\s*balance.*?(?:of|for)\s+([a-z]+)/i) || lowerMsg.match(/([a-z]+)(?:'s)\s+leave\s*balance/i);
      const searchName = lbMatch[1].toLowerCase();
      const matchedEmp = allEmployees.find(e =>
        e.firstName.toLowerCase() === searchName || e.lastName.toLowerCase() === searchName
      );

      if (matchedEmp) {
        const lb = matchedEmp.leaveBalance || {};
        reply = `🏖️ **${matchedEmp.firstName} ${matchedEmp.lastName}**'s leave balance:\n\n` +
          `• Casual Leave: **${lb.casual || 0}** days\n` +
          `• Sick Leave: **${lb.sick || 0}** days\n` +
          `• Earned Leave: **${lb.earned || 0}** days\n` +
          `• Comp Off: **${lb.compOff || 0}** days\n` +
          `• **Total Available:** ${(lb.casual || 0) + (lb.sick || 0) + (lb.earned || 0) + (lb.compOff || 0)} days`;
      } else {
        reply = `❌ Employee "${searchName}" not found. Please try the full name.`;
      }
    }

    // ─── Loan queries ─────────────────────────────────────
    else if (lowerMsg.includes('active loan') || lowerMsg.includes('loan status') || lowerMsg.includes('how many loan')) {
      const activeLoans = allLoans.filter(l => l.status === 'Active');
      const totalOutstanding = activeLoans.reduce((s, l) => s + (l.remainingAmount || 0), 0);

      reply = `🏦 **Loan Summary:**\n\n` +
        `• Total Loans: **${allLoans.length}**\n` +
        `• Active Loans: **${activeLoans.length}**\n` +
        `• Total Outstanding: **₹${totalOutstanding.toLocaleString('en-IN')}**\n\n`;

      if (activeLoans.length > 0) {
        reply += `Active loans:\n`;
        activeLoans.slice(0, 5).forEach((l, i) => {
          reply += `${i + 1}. **${l.employeeName}** — ${l.type} — ₹${(l.remainingAmount || 0).toLocaleString('en-IN')} remaining (${l.paidEmis}/${l.tenure} EMIs)\n`;
        });
      }
    }

    // ─── Employee count / total employees ──────────────────
    else if (lowerMsg.includes('how many employee') || lowerMsg.includes('total employee') || lowerMsg.includes('employee count') || lowerMsg.includes('headcount')) {
      const deptCount = {};
      allEmployees.forEach(e => {
        deptCount[e.department] = (deptCount[e.department] || 0) + 1;
      });

      reply = `👥 **Total Active Employees:** ${allEmployees.length}\n\n**Department Breakdown:**\n`;
      Object.entries(deptCount).forEach(([dept, count]) => {
        reply += `• ${dept}: **${count}**\n`;
      });
    }

    // ─── Payroll summary ──────────────────────────────────
    else if (lowerMsg.includes('payroll') || lowerMsg.includes('pay run') || lowerMsg.includes('last pay')) {
      const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
      const monthMatch = months.find(m => lowerMsg.includes(m));
      
      let targetRun;
      if (monthMatch) {
         targetRun = allPayRuns.find(pr => pr.month.toLowerCase() === monthMatch && pr.status === 'Paid');
      } else {
         const paidRuns = allPayRuns.filter(pr => pr.status === 'Paid');
         targetRun = paidRuns[0];
      }

      if (targetRun) {
        const totalNet = targetRun.employees.reduce((s, e) => s + e.netPay, 0);
        const totalGross = targetRun.employees.reduce((s, e) => s + e.gross, 0);
        const totalDed = targetRun.employees.reduce((s, e) => s + e.deductions, 0);

        reply = `📊 **Payroll (${targetRun.month} ${targetRun.year}):**\n\n` +
          `• Employees Covered: **${targetRun.employees.length}**\n` +
          `• Total Gross: **₹${totalGross.toLocaleString('en-IN')}**\n` +
          `• Total Deductions: **₹${totalDed.toLocaleString('en-IN')}**\n` +
          `• Total Net Pay: **₹${totalNet.toLocaleString('en-IN')}**\n` +
          `• Pay Date: ${targetRun.payDate || 'Processed'}\n` +
          `• Status: **${targetRun.status}**`;
      } else {
        if (monthMatch) {
           reply = `📊 No paid payroll found for **${monthMatch.charAt(0).toUpperCase() + monthMatch.slice(1)}**.`;
        } else {
           const draftRuns = allPayRuns.filter(pr => pr.status === 'Draft' || pr.status === 'Approved');
           reply = `📊 No payroll has been processed yet. There are **${draftRuns.length}** pending pay run(s).`;
        }
      }
    }

    // ─── Department info ──────────────────────────────────
    else if (lowerMsg.includes('department')) {
      const deptCount = {};
      allEmployees.forEach(e => {
        deptCount[e.department] = (deptCount[e.department] || 0) + 1;
      });

      reply = `🏢 **Department Overview:**\n\n`;
      Object.entries(deptCount).sort((a, b) => b[1] - a[1]).forEach(([dept, count]) => {
        reply += `• ${dept}: **${count}** employee(s)\n`;
      });
    }

    // ─── Tax queries ──────────────────────────────────────
    else if (lowerMsg.includes('tax') || lowerMsg.includes('tds') || lowerMsg.includes('epf') || lowerMsg.includes('esi')) {
      const epfTotal = allEmployees.reduce((s, e) => s + Math.round((e.salary.basic || 0) / 12 * 0.12), 0);
      const esiTotal = allEmployees.reduce((s, e) => {
        const gross = Math.round((e.salary.ctc || 0) / 12);
        return s + (gross <= 21000 ? Math.round(gross * 0.0075) : 0);
      }, 0);
      const ptTotal = allEmployees.length * 200;

      reply = `🧾 **Monthly Tax & Statutory Summary:**\n\n` +
        `• EPF (Provident Fund): **₹${epfTotal.toLocaleString('en-IN')}**\n` +
        `• ESI (State Insurance): **₹${esiTotal.toLocaleString('en-IN')}**\n` +
        `• Professional Tax: **₹${ptTotal.toLocaleString('en-IN')}**\n` +
        `• Total Monthly Deductions: **₹${(epfTotal + esiTotal + ptTotal).toLocaleString('en-IN')}**`;
    }

    // ─── Help / default ───────────────────────────────────
    else if (lowerMsg.includes('help') || lowerMsg.includes('what can you')) {
      reply = `🤖 **I'm your HR/Payroll AI Assistant!** Here's what I can help with:\n\n` +
        `💰 **Salary:** "What is Meera's net pay?" or "Salary of Rajesh"\n` +
        `📋 **Leaves:** "How many leaves are pending?" or "Priya's leave balance"\n` +
        `🏦 **Loans:** "Active loan status" or "How many loans?"\n` +
        `👥 **Employees:** "Total employee count" or "Headcount"\n` +
        `📊 **Payroll:** "Latest payroll summary" or "Last pay run"\n` +
        `🏢 **Departments:** "Department overview"\n` +
        `🧾 **Tax:** "Monthly tax summary" or "EPF details"\n\n` +
        `Just ask in natural language! 😊`;
    }

    // ─── Greeting ─────────────────────────────────────────
    else if (lowerMsg.match(/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings)/)) {
      reply = `👋 Hello! I'm your AI Payroll Assistant. How can I help you today?\n\nTry asking me things like:\n` +
        `• "What is Meera's net pay?"\n` +
        `• "How many leaves are pending?"\n` +
        `• "Total employee count"\n` +
        `• "Latest payroll summary"`;
    }

    // ─── Fallback ─────────────────────────────────────────
    else {
      // Try to find employee by any name mentioned
      const words = lowerMsg.split(/\s+/).filter(w => w.length > 2);
      let foundEmp = null;
      for (const word of words) {
        foundEmp = allEmployees.find(e =>
          e.firstName.toLowerCase() === word || e.lastName.toLowerCase() === word
        );
        if (foundEmp) break;
      }

      if (foundEmp) {
        const monthlyCTC = Math.round((foundEmp.salary.ctc || 0) / 12);
        const monthlyBasic = Math.round((foundEmp.salary.basic || 0) / 12);
        const epf = Math.round(monthlyBasic * 0.12);
        const esi = monthlyCTC <= 21000 ? Math.round(monthlyCTC * 0.0075) : 0;
        const pt = 200;
        const netPay = monthlyCTC - epf - esi - pt;
        const lb = foundEmp.leaveBalance || {};

        reply = `📋 **${foundEmp.firstName} ${foundEmp.lastName}** — Quick Overview:\n\n` +
          `• Department: ${foundEmp.department}\n` +
          `• Designation: ${foundEmp.designation}\n` +
          `• Monthly Net Pay: **₹${netPay.toLocaleString('en-IN')}**\n` +
          `• Leave Balance: **${(lb.casual || 0) + (lb.sick || 0) + (lb.earned || 0) + (lb.compOff || 0)}** days\n` +
          `• Status: ${foundEmp.status || 'Active'}`;
      } else {
        reply = `🤔 I'm not sure how to answer that. Try asking me:\n\n` +
          `• "What is [employee name]'s net pay?"\n` +
          `• "How many leaves are pending?"\n` +
          `• "Active loan status"\n` +
          `• "Total employee count"\n` +
          `• "Latest payroll summary"\n\n` +
          `Type **"help"** for more options!`;
      }
    }

    res.json({ success: true, data: { reply } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
