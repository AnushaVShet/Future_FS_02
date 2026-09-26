const loginForm = document.getElementById("loginForm");
let allLeads = [];
let selectedLeadId = null;
const loginMessage = document.getElementById("loginMessage");

const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");

const adminName = document.getElementById("adminName");
const logoutButton = document.getElementById("logoutButton");


// =========================================
// LOGIN
// =========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginMessage.textContent = "";
    loginMessage.className = "login-message";


    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {
            throw new Error(
                data.message || "Login failed"
            );
        }


        // Save authentication information

        localStorage.setItem(
            "crmToken",
            data.token
        );

        localStorage.setItem(
            "crmAdmin",
            JSON.stringify(data.admin)
        );


        // Show success message

        loginMessage.textContent =
            "Login successful!";

        loginMessage.classList.add("success");


        // Show dashboard

        showDashboard(data.admin);


    } catch (error) {

        loginMessage.textContent =
            error.message;

        loginMessage.classList.add("error");

    }

});


// =========================================
// SHOW DASHBOARD
// =========================================

function showDashboard(admin) {

    loginPage.style.display = "none";

    dashboardPage.style.display = "block";

    if (admin) {

        adminName.textContent =
            admin.name || "Admin";

    }

    loadLeads();

}


// =========================================
// LOGOUT
// =========================================

logoutButton.addEventListener("click", () => {

    localStorage.removeItem("crmToken");

    localStorage.removeItem("crmAdmin");

    dashboardPage.style.display = "none";

    loginPage.style.display = "flex";

    loginForm.reset();

    loginMessage.textContent = "";

    loginMessage.className = "login-message";

});


// =========================================
// CHECK EXISTING LOGIN
// =========================================

function checkLogin() {

    const token =
        localStorage.getItem("crmToken");

    const savedAdmin =
        localStorage.getItem("crmAdmin");


    if (token && savedAdmin) {

        try {

            const admin =
                JSON.parse(savedAdmin);

            showDashboard(admin);

        } catch (error) {

            localStorage.removeItem("crmToken");

            localStorage.removeItem("crmAdmin");

        }

    }

}


// Check login when page loads

checkLogin();
// =========================================
// LOAD LEADS
// =========================================

async function loadLeads() {

    const token = localStorage.getItem("crmToken");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/leads",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("crmToken");
            localStorage.removeItem("crmAdmin");

            dashboardPage.style.display = "none";
            loginPage.style.display = "flex";

            return;
        }


        const leads = await response.json();
allLeads = leads;

        if (!response.ok) {
            throw new Error(
                leads.message || "Failed to load leads"
            );
        }


        displayLeads(leads);
        updateMetrics(leads);
        updateAnalytics(leads);


    } catch (error) {

        console.error(
            "Failed to load leads:",
            error
        );

    }
}


// =========================================
// DISPLAY LEADS
// =========================================

function displayLeads(leads) {

    const tableBody =
        document.getElementById("leadsTableBody");

    if (!leads.length) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <div>
                        No leads to display
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML = leads.map((lead) => {

        const createdDate =
            new Date(lead.createdAt)
                .toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


        const statusLabel =
            lead.status.charAt(0).toUpperCase() +
            lead.status.slice(1);


        return `
            <tr>

                <td>
                    <strong>
                        ${lead.name}
                    </strong>

                    <br>

                    <small>
                        ${lead.email}
                    </small>
                </td>

                <td>
                    ${lead.company || "—"}
                </td>

                <td>
                    ${lead.source || "Website"}
                </td>

                <td>
                    <span class="status-badge status-${lead.status}">
                        ${statusLabel}
                    </span>
                </td>

                <td>
                    ${createdDate}
                </td>

                <td>
                    <button
                        class="table-action"
                        onclick="viewLead('${lead._id}')"
                    >
                        View
                    </button>
                </td>

            </tr>
        `;

    }).join("");

}


// =========================================
// UPDATE DASHBOARD METRICS
// =========================================

function updateMetrics(leads) {

    const total =
        leads.length;

    const newCount =
        leads.filter(
            lead => lead.status === "new"
        ).length;

    const contactedCount =
        leads.filter(
            lead => lead.status === "contacted"
        ).length;

    const convertedCount =
        leads.filter(
            lead => lead.status === "converted"
        ).length;


    document.getElementById(
        "totalLeads"
    ).textContent = total;


    document.getElementById(
        "newLeads"
    ).textContent = newCount;


    document.getElementById(
        "contactedLeads"
    ).textContent = contactedCount;


    document.getElementById(
        "convertedLeads"
    ).textContent = convertedCount;

}


// =========================================
// VIEW LEAD
// =========================================

function viewLead(id) {
selectedLeadId = id;

    const lead = allLeads.find(
        (item) => item._id === id
    );

    if (!lead) {
        console.error("Lead not found:", id);
        return;
    }

    document.getElementById("leadModal").classList.add("show");

    document.getElementById("modalLeadName").textContent =
        lead.name;

    document.getElementById("modalLeadEmail").textContent =
        lead.email;

    document.getElementById("modalLeadPhone").textContent =
        lead.phone || "Not provided";

    document.getElementById("modalLeadCompany").textContent =
        lead.company || "Not provided";

    document.getElementById("modalLeadSource").textContent =
        lead.source || "Website";

    document.getElementById("modalLeadStatus").value =
    lead.status;
    displayNotes(lead.notes);
    
    
}
document
    .getElementById("modalLeadStatus")
    .addEventListener("change", async function () {

        const newStatus = this.value;

        const leadName =
            document.getElementById("modalLeadName").textContent;

        const lead = allLeads.find(
            (item) => item.name === leadName
        );

        if (!lead) {
            console.error("Lead not found.");
            return;
        }

        const token = localStorage.getItem("crmToken");

        if (!token) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/leads/${lead._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update status"
                );
            }

            lead.status = newStatus;

            applyLeadFilters();

            updateMetrics(allLeads);

            console.log("Lead status updated successfully.");

        } catch (error) {

            console.error(
                "Failed to update lead status:",
                error
            );

        }

    });

// =========================================
// SEARCH + FILTER
// =========================================

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");


// Store the leads currently loaded from the API



// Search

searchInput.addEventListener(
    "input",
    applyLeadFilters
);


// Status filter

statusFilter.addEventListener(
    "change",
    applyLeadFilters
);


// =========================================
// APPLY FILTERS
// =========================================

function applyLeadFilters() {

    const searchTerm =
        searchInput.value.trim().toLowerCase();

    const selectedStatus =
        statusFilter.value;


    const filteredLeads = allLeads.filter((lead) => {

        const name =
            String(lead.name || "").toLowerCase();

        const email =
            String(lead.email || "").toLowerCase();

        const company =
            String(lead.company || "").toLowerCase();

        const source =
            String(lead.source || "").toLowerCase();


        const matchesSearch =
            name.includes(searchTerm) ||
            email.includes(searchTerm) ||
            company.includes(searchTerm) ||
            source.includes(searchTerm);


        const matchesStatus =
            selectedStatus === "all" ||
            lead.status === selectedStatus;


        return matchesSearch && matchesStatus;

    });


    displayLeads(filteredLeads);
}
const leadModal = document.getElementById("leadModal");
const closeLeadModal = document.getElementById("closeLeadModal");
const leadModalOverlay = document.getElementById("leadModalOverlay");

closeLeadModal.addEventListener("click", () => {
    leadModal.classList.remove("show");
});

leadModalOverlay.addEventListener("click", () => {
    leadModal.classList.remove("show");
});
document
    .getElementById("addNoteButton")
    .addEventListener("click", async function () {

        const noteInput =
            document.getElementById("noteInput");

        const noteText =
            noteInput.value.trim();

        if (!selectedLeadId) {
            console.error("No lead selected.");
            return;
        }

        if (!noteText) {
            alert("Please enter a note.");
            return;
        }

        const token =
            localStorage.getItem("crmToken");

        if (!token) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/leads/${selectedLeadId}/notes`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        text: noteText
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
    data.error || data.message || "Failed to add note"
);
            }

            // Update the lead in local data
            const lead = allLeads.find(
                (item) => item._id === selectedLeadId
            );

            if (lead) {
                lead.notes = data.lead.notes;
            }

            // Clear the input
            noteInput.value = "";

            // Display the updated notes
            displayNotes(data.lead.notes);

        } catch (error) {

           alert("Failed to add note: " + error.message);
        }

    });
    function displayNotes(notes) {

    const notesList =
        document.getElementById("notesList");

    if (!notes || notes.length === 0) {

        notesList.innerHTML = `
            <div class="notes-empty">
                No follow-up notes yet.
            </div>
        `;

        return;
    }

    notesList.innerHTML = notes
        .slice()
        .reverse()
        .map((note) => {

            const noteDate =
                new Date(note.createdAt).toLocaleString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

            return `
                <div class="note-item">

                    <div class="note-text">
                        ${note.text}
                    </div>

                    <span class="note-date">
                        ${noteDate}
                    </span>

                </div>
            `;

        })
        .join("");
}
// ===============================
// ADD LEAD MODAL
// ===============================

const addLeadButton = document.getElementById("addLeadButton");
const addLeadModal = document.getElementById("addLeadModal");
const closeAddLeadModal = document.getElementById("closeAddLeadModal");
const addLeadModalOverlay = document.getElementById("addLeadModalOverlay");
const addLeadForm = document.getElementById("addLeadForm");

// Open Add Lead modal
addLeadButton.addEventListener("click", () => {
    addLeadModal.classList.add("show");
});

// Close Add Lead modal
closeAddLeadModal.addEventListener("click", () => {
    addLeadModal.classList.remove("show");
});

// Close when clicking outside the modal
addLeadModalOverlay.addEventListener("click", () => {
    addLeadModal.classList.remove("show");
});

// Create new lead
addLeadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("crmToken");

    if (!token) {
        alert("Please login again.");
        return;
    }

    const leadData = {
        name: document.getElementById("addLeadName").value.trim(),
        email: document.getElementById("addLeadEmail").value.trim(),
        phone: document.getElementById("addLeadPhone").value.trim(),
        company: document.getElementById("addLeadCompany").value.trim(),
        source: document.getElementById("addLeadSource").value,
        status: document.getElementById("addLeadStatus").value
    };

    try {
        const response = await fetch("http://localhost:5000/api/leads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(leadData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || data.message || "Failed to create lead"
            );
        }

        alert("Lead created successfully!");

        addLeadForm.reset();
        addLeadModal.classList.remove("show");

        await loadLeads();

    } catch (error) {
        alert("Failed to create lead: " + error.message);
    }
});
// =========================================
// SIDEBAR - LEADS
// =========================================

const leadsNavButton = document.getElementById("leadsNavButton");

leadsNavButton.addEventListener("click", () => {

    const leadsTableBody = document.getElementById("leadsTableBody");

    if (leadsTableBody) {
        leadsTableBody.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

});
// =========================================
// SIDEBAR - ANALYTICS
// =========================================

// =========================================
// SIDEBAR - ANALYTICS
// =========================================

const analyticsNavButton = document.getElementById("analyticsNavButton");

analyticsNavButton.addEventListener("click", () => {

    const analyticsSection = document.getElementById("analyticsSection");

    if (analyticsSection) {
        analyticsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

});
// =========================================
// ANALYTICS - UPDATE DATA
// =========================================

function updateAnalytics(leads) {

    const total = leads.length;

    const newLeads = leads.filter(
        lead => lead.status === "new"
    ).length;

    const contactedLeads = leads.filter(
        lead => lead.status === "contacted"
    ).length;

    const convertedLeads = leads.filter(
        lead => lead.status === "converted"
    ).length;


    // Numbers

    document.getElementById("analyticsTotalLeads").textContent = total;

    document.getElementById("analyticsNewLeads").textContent = newLeads;

    document.getElementById("analyticsContactedLeads").textContent = contactedLeads;

    document.getElementById("analyticsConvertedLeads").textContent = convertedLeads;


    // Percentages

    const newPercent = total
        ? Math.round((newLeads / total) * 100)
        : 0;

    const contactedPercent = total
        ? Math.round((contactedLeads / total) * 100)
        : 0;

    const convertedPercent = total
        ? Math.round((convertedLeads / total) * 100)
        : 0;


    document.getElementById("analyticsNewPercent").textContent =
        `${newPercent}%`;

    document.getElementById("analyticsContactedPercent").textContent =
        `${contactedPercent}%`;

    document.getElementById("analyticsConvertedPercent").textContent =
        `${convertedPercent}%`;


    // Progress bars

    document.getElementById("analyticsNewBar").style.width =
        `${newPercent}%`;

    document.getElementById("analyticsContactedBar").style.width =
        `${contactedPercent}%`;

    document.getElementById("analyticsConvertedBar").style.width =
        `${convertedPercent}%`;


    // Conversion rate

    const conversionRate = total
        ? ((convertedLeads / total) * 100).toFixed(1)
        : "0.0";

    document.getElementById("analyticsConversionRate").textContent =
        `${conversionRate}%`;
}
// =========================================
// SIDEBAR - SETTINGS
// =========================================

const settingsNavButton = document.getElementById("settingsNavButton");

settingsNavButton.addEventListener("click", () => {

    const settingsSection = document.getElementById("settingsSection");

    if (settingsSection) {
        settingsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

});
// =========================================
// SETTINGS - LOGOUT
// =========================================

const settingsLogoutButton = document.getElementById("settingsLogoutButton");

settingsLogoutButton.addEventListener("click", () => {

    localStorage.removeItem("crmToken");
    localStorage.removeItem("crmAdmin");

    dashboardPage.style.display = "none";
    loginPage.style.display = "flex";

});
// =========================================
// SETTINGS - ADMIN INFORMATION
// =========================================

function loadAdminSettings() {

    const adminData = localStorage.getItem("crmAdmin");

    if (!adminData) {
        return;
    }

    try {

        const admin = JSON.parse(adminData);

        const nameElement = document.getElementById("settingsAdminName");
        const emailElement = document.getElementById("settingsAdminEmail");

        if (nameElement && admin.name) {
            nameElement.textContent = admin.name;
        }

        if (emailElement && admin.email) {
            emailElement.textContent = admin.email;
        }

    } catch (error) {

        console.error(
            "Failed to load admin information:",
            error
        );

    }
}

loadAdminSettings();
   