
/* =========================================================
   DOM ELEMENTS
========================================================= */

const messageInput =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const messages =
    document.getElementById("messages");

const customerList =
    document.getElementById("customerList");

const customerSearch =
    document.getElementById("customerSearch");

const addCustomerButton =
    document.getElementById("addCustomerButton");

const addCustomerModal =
    document.getElementById("addCustomerModal");

const closeCustomerModal =
    document.getElementById("closeCustomerModal");

const cancelCustomer =
    document.getElementById("cancelCustomer");

const customerForm =
    document.getElementById("customerForm");

const saveCustomer =
    document.getElementById("saveCustomer");

const newCustomerName =
    document.getElementById("newCustomerName");

const newCustomerEmail =
    document.getElementById("newCustomerEmail");

const noCustomers =
    document.getElementById("noCustomers");

const customerContextMenu =
    document.getElementById("customerContextMenu");

const viewCustomer =
    document.getElementById("viewCustomer");

const deleteCustomer =
    document.getElementById("deleteCustomer");

const conversationTitle =
    document.getElementById("conversationTitle");

const conversationAvatar =
    document.getElementById("conversationAvatar");

const profileEmail =
    document.getElementById("profileEmail");

const memoryList =
    document.getElementById("memoryList");

const memoryCount =
    document.getElementById("memoryCount");


/* =========================================================
   CURRENT CUSTOMER
========================================================= */

let currentCustomer = "Alice Smith";

let currentCustomerId = "cust_101";

let currentCustomerEmail = "alice@example.com";

let selectedCustomerElement = null;


/* =========================================================
   HELPER - INITIALS
========================================================= */

function getInitials(name) {

    return name
        .trim()
        .split(/\s+/)
        .map(function (word) {
            return word.charAt(0);
        })
        .join("")
        .substring(0, 2)
        .toUpperCase();
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text == null ? "" : String(text);

    return div.innerHTML;
}


/* =========================================================
   MARKDOWN INLINE FORMATTER
========================================================= */

function formatInlineMarkdown(text) {

    let html =
        escapeHtml(text);


    /* Bold */

    html =
        html.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    /* Italic */

    html =
        html.replace(
            /(?<!\*)\*([^*]+)\*(?!\*)/g,
            "<em>$1</em>"
        );


    /* Inline code */

    html =
        html.replace(
            /`([^`]+)`/g,
            "<code>$1</code>"
        );


    return html;
}


/* =========================================================
   MARKDOWN MESSAGE RENDERER
========================================================= */

function renderMarkdown(text) {

    if (!text) {
        return "";
    }


    const lines =
        String(text).split("\n");


    let html = "";

    let i = 0;


    while (i < lines.length) {

        const line =
            lines[i];


        /* -----------------------------------------
           MARKDOWN TABLE
        ----------------------------------------- */

        if (
            line.trim().startsWith("|") &&
            i + 1 < lines.length &&
            lines[i + 1].includes("|")
        ) {

            const headerCells =
                line
                    .split("|")
                    .slice(1, -1)
                    .map(function (cell) {
                        return cell.trim();
                    });


            const separatorCells =
                lines[i + 1]
                    .split("|")
                    .slice(1, -1)
                    .map(function (cell) {
                        return cell.trim();
                    });


            const isTable =
                headerCells.length > 0 &&
                separatorCells.length ===
                    headerCells.length &&
                separatorCells.every(
                    function (cell) {

                        return /^:?-{3,}:?$/.test(
                            cell
                        );

                    }
                );


            if (isTable) {

                html += `
                    <div class="message-table-wrapper">
                        <table class="message-table">

                            <thead>
                                <tr>
                `;


                headerCells.forEach(
                    function (cell) {

                        html += `
                            <th>
                                ${escapeHtml(cell)}
                            </th>
                        `;

                    }
                );


                html += `
                                </tr>
                            </thead>

                            <tbody>
                `;


                i += 2;


                while (
                    i < lines.length &&
                    lines[i]
                        .trim()
                        .startsWith("|")
                ) {

                    const cells =
                        lines[i]
                            .split("|")
                            .slice(1, -1)
                            .map(function (cell) {
                                return cell.trim();
                            });


                    html += "<tr>";


                    cells.forEach(
                        function (cell) {

                            html += `
                                <td>
                                    ${formatInlineMarkdown(
                                        cell
                                    )}
                                </td>
                            `;

                        }
                    );


                    html += "</tr>";


                    i++;

                }


                html += `
                            </tbody>

                        </table>
                    </div>
                `;


                continue;

            }

        }


        /* -----------------------------------------
           BULLET LIST
        ----------------------------------------- */

        if (
            line.trim().startsWith("- ") ||
            line.trim().startsWith("* ")
        ) {

            html += "<ul>";


            while (
                i < lines.length &&
                (
                    lines[i]
                        .trim()
                        .startsWith("- ") ||

                    lines[i]
                        .trim()
                        .startsWith("* ")
                )
            ) {

                const item =
                    lines[i]
                        .trim()
                        .substring(2);


                html += `
                    <li>
                        ${formatInlineMarkdown(item)}
                    </li>
                `;


                i++;

            }


            html += "</ul>";


            continue;

        }


        /* -----------------------------------------
           NUMBERED LIST
        ----------------------------------------- */

        if (
            /^\s*\d+\.\s+/.test(line)
        ) {

            html += "<ol>";


            while (
                i < lines.length &&
                /^\s*\d+\.\s+/.test(lines[i])
            ) {

                const item =
                    lines[i]
                        .replace(
                            /^\s*\d+\.\s+/,
                            ""
                        );


                html += `
                    <li>
                        ${formatInlineMarkdown(item)}
                    </li>
                `;


                i++;

            }


            html += "</ol>";


            continue;

        }


        /* -----------------------------------------
           EMPTY LINE
        ----------------------------------------- */

        if (
            line.trim() === ""
        ) {

            html += "<br>";


            i++;


            continue;

        }


        /* -----------------------------------------
           NORMAL TEXT
        ----------------------------------------- */

        html += `
            <div>
                ${formatInlineMarkdown(line)}
            </div>
        `;


        i++;

    }


    return html;

}


/* =========================================================
   FIND MEMORY SECTION
========================================================= */

function findMemorySection(title) {

    const headings =
        document.querySelectorAll(
            ".memory-section h3"
        );


    for (const heading of headings) {

        if (
            heading.textContent
                .trim()
                .toLowerCase() ===
            title.toLowerCase()
        ) {

            return heading.parentElement;

        }

    }


    return null;

}


/* =========================================================
   UPDATE PREVIOUS ISSUES
========================================================= */

function updatePreviousIssues(tickets) {

    const section =
        findMemorySection(
            "Previous Issues"
        );


    if (!section) {
        return;
    }


    const oldItems =
        section.querySelectorAll(
            ".memory-item"
        );


    oldItems.forEach(function (item) {
        item.remove();
    });


    if (
        !tickets ||
        tickets.length === 0
    ) {

        const empty =
            document.createElement("p");


        empty.className =
            "memory-empty-text";


        empty.textContent =
            "No previous issues recorded.";


        section.appendChild(
            empty
        );


        return;

    }


    tickets.forEach(function (ticket) {

        const item =
            document.createElement("div");


        item.className =
            "memory-item";


        let title =
            ticket.issue ||
            ticket.title ||
            ticket.subject ||
            ticket.problem ||
            "Support issue";


        let date =
            ticket.date ||
            ticket.created_at ||
            ticket.createdAt ||
            ticket.status ||
            "";


        item.innerHTML = `

            <div class="memory-icon">
                📦
            </div>

            <div>

                <strong>
                    ${escapeHtml(title)}
                </strong>

                <span>
                    ${escapeHtml(date)}
                </span>

            </div>

        `;


        section.appendChild(
            item
        );

    });

}


/* =========================================================
   UPDATE KNOWN ISSUES
========================================================= */

function updateKnownIssues(issues) {

    const section =
        findMemorySection(
            "Known Issues"
        );


    if (!section) {
        return;
    }


    const oldTags =
        section.querySelectorAll(
            ".tag"
        );


    oldTags.forEach(function (tag) {
        tag.remove();
    });


    if (
        !issues ||
        issues.length === 0
    ) {

        const empty =
            document.createElement("p");


        empty.className =
            "memory-empty-text";


        empty.textContent =
            "No known issues.";


        section.appendChild(
            empty
        );


        return;

    }


    issues.forEach(function (issue) {

        const tag =
            document.createElement("div");


        tag.className =
            "tag";


        const text =
            issue.issue ||
            issue.title ||
            issue.description ||
            issue.name ||
            "Known issue";


        tag.textContent =
            text;


        section.appendChild(
            tag
        );

    });

}


/* =========================================================
   UPDATE SOLUTIONS
========================================================= */

function updateSolutions(solutions) {

    const section =
        findMemorySection(
            "Solutions That Worked"
        );


    if (!section) {
        return;
    }


    const oldSolutions =
        section.querySelectorAll(
            ".solution"
        );


    oldSolutions.forEach(function (solution) {
        solution.remove();
    });


    if (
        !solutions ||
        solutions.length === 0
    ) {

        const empty =
            document.createElement("p");


        empty.className =
            "memory-empty-text";


        empty.textContent =
            "No previous solutions recorded.";


        section.appendChild(
            empty
        );


        return;

    }


    solutions.forEach(function (solution) {

        const item =
            document.createElement("div");


        item.className =
            "solution";


        const text =
            solution.solution ||
            solution.description ||
            solution.action ||
            solution.name ||
            "Previous solution";


        item.innerHTML = `

            <span>
                ✓
            </span>

            <p>
                ${escapeHtml(text)}
            </p>

        `;


        section.appendChild(
            item
        );

    });

}


/* =========================================================
   UPDATE CUSTOMER PROFILE
========================================================= */

function updateCustomerProfile(customer) {

    if (!customer) {
        return;
    }


    profileEmail.textContent =
        customer.email || "";


    const profileCard =
        document.querySelector(
            ".profile-card"
        );


    if (!profileCard) {
        return;
    }


    const rows =
        profileCard.querySelectorAll(
            ".profile-row"
        );


    /*
       Keep the existing profile layout.

       First row = Email
       Second row = Preferred contact
    */

    if (rows.length >= 1) {

        const emailValue =
            rows[0].querySelector("strong");


        if (emailValue) {

            emailValue.textContent =
                customer.email || "—";

        }

    }


    if (rows.length >= 2) {

        const preferredValue =
            rows[1].querySelector("strong");


        if (preferredValue) {

            /*
               Your customer data currently stores
               notes rather than a dedicated preferred
               contact field.
            */

            let preferredContact =
                "Not specified";


            const notes =
                (
                    customer.notes || ""
                ).toLowerCase();


            if (
                notes.includes("email")
            ) {

                preferredContact =
                    "Email";

            }


            preferredValue.textContent =
                preferredContact;

        }

    }

}


/* =========================================================
   LOAD CUSTOMER CONTEXT
========================================================= */

async function loadCustomerContext(
    customerId
) {

    if (!customerId) {
        return;
    }


    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/customers/" +
                encodeURIComponent(customerId)
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Could not load customer information."
            );

        }


        const context =
            data.context || {};


        /*
           Update the right-side memory panel.
        */

        updatePreviousIssues(
            context.tickets || []
        );


        updateKnownIssues(
            context.known_issues || []
        );


        updateSolutions(
            context.solutions || []
        );


        updateCustomerProfile(
            context.customer
        );


    } catch (error) {

        console.error(
            "Customer context error:",
            error
        );

    }

}


/* =========================================================
   RESET CHAT
========================================================= */

function resetConversation() {

    messages.innerHTML = `

        <div class="date-divider">
            Today
        </div>

        <div class="message-row bot-row">

            <div class="bot-avatar">
                H
            </div>

            <div>

                <div class="message-label">
                    Hindsight AI
                </div>

                <div class="message bot">

                    Hello ${escapeHtml(currentCustomer)}! 👋

                    <br><br>

                    I have your previous support history available.
                    How can I help you today?

                </div>

                <div class="message-time">
                    Just now
                </div>

            </div>

        </div>

    `;


    /*
       Reset ONLY Hindsight memory recall.

       The structured customer information
       remains visible on the right side.
    */

    memoryList.innerHTML = `

        <div class="memory-empty">

            <div class="memory-empty-icon">
                🧠
            </div>

            <h3>
                No memories yet
            </h3>

            <p>
                Previous customer interactions
                will appear here.
            </p>

        </div>

    `;


    memoryCount.textContent =
        "0";


    /*
       Reload the selected customer's
       structured information.
    */

    loadCustomerContext(
        currentCustomerId
    );

}


/* =========================================================
   SELECT CUSTOMER
========================================================= */

function selectCustomer(customerElement) {

    if (!customerElement) {
        return;
    }


    const customerId =
        customerElement.dataset.customerId;


    const customerName =
        customerElement.dataset.name;


    const customerEmail =
        customerElement.dataset.email;


    currentCustomerId =
        customerId;


    currentCustomer =
        customerName;


    currentCustomerEmail =
        customerEmail;


    /* Remove previous active */

    document
        .querySelectorAll(".customer")
        .forEach(function (customer) {

            customer.classList.remove(
                "active"
            );

        });


    /* Add active */

    customerElement.classList.add(
        "active"
    );


    selectedCustomerElement =
        customerElement;


    /* Update chat header */

    conversationTitle.textContent =
        customerName;


    conversationAvatar.textContent =
        getInitials(customerName);


    profileEmail.textContent =
        customerEmail;


    /* Reset chat + load customer memory */

    resetConversation();


    /* Focus */

    messageInput.focus();

}


/* =========================================================
   SETUP CUSTOMER ROW
========================================================= */

function setupCustomer(customer) {

    const menuButton =
        customer.querySelector(
            ".customer-menu"
        );


    /* Customer click */

    customer.addEventListener(
        "click",
        function (event) {

            if (
                event.target.closest(
                    ".customer-menu"
                )
            ) {

                return;

            }


            selectCustomer(
                customer
            );

        }
    );


    /* Three-dot menu */

    if (menuButton) {

        menuButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                selectedCustomerElement =
                    customer;


                showCustomerContextMenu(
                    customer,
                    event
                );

            }
        );

    }

}


/* =========================================================
   INITIAL CUSTOMER SETUP
========================================================= */

document
    .querySelectorAll(".customer")
    .forEach(function (customer) {

        setupCustomer(
            customer
        );

    });


/* Select Alice */

const initialCustomer =
    document.querySelector(
        '.customer[data-customer-id="cust_101"]'
    );


if (initialCustomer) {

    selectCustomer(
        initialCustomer
    );

}


/* =========================================================
   CUSTOMER SEARCH
========================================================= */

customerSearch.addEventListener(
    "input",
    function () {

        const search =
            customerSearch.value
                .trim()
                .toLowerCase();


        let visibleCount = 0;


        document
            .querySelectorAll(".customer")
            .forEach(function (customer) {

                const name =
                    customer.dataset.name
                        .toLowerCase();


                const email =
                    customer.dataset.email
                        .toLowerCase();


                const matches =
                    name.includes(search) ||
                    email.includes(search);


                customer.style.display =
                    matches
                        ? "flex"
                        : "none";


                if (matches) {

                    visibleCount++;

                }

            });


        noCustomers.style.display =
            visibleCount === 0
                ? "block"
                : "none";

    }
);


/* =========================================================
   ADD CUSTOMER MODAL
========================================================= */

function openCustomerModal() {

    addCustomerModal.style.display =
        "flex";


    newCustomerName.focus();

}


function closeCustomerModalWindow() {

    addCustomerModal.style.display =
        "none";


    newCustomerName.value =
        "";


    newCustomerEmail.value =
        "";

}


addCustomerButton.addEventListener(
    "click",
    openCustomerModal
);


closeCustomerModal.addEventListener(
    "click",
    closeCustomerModalWindow
);


cancelCustomer.addEventListener(
    "click",
    closeCustomerModalWindow
);


/* Close outside */

addCustomerModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            addCustomerModal
        ) {

            closeCustomerModalWindow();

        }

    }
);


/* =========================================================
   ADD CUSTOMER - BACKEND + HINDSIGHT
========================================================= */

customerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            newCustomerName.value.trim();


        const email =
            newCustomerEmail.value.trim();


        if (!name) {

            alert(
                "Please enter the customer name."
            );


            newCustomerName.focus();


            return;

        }


        if (!email) {

            alert(
                "Please enter the customer email."
            );


            newCustomerEmail.focus();


            return;

        }


        saveCustomer.disabled =
            true;


        saveCustomer.textContent =
            "Adding...";


        try {

            const response =
                await fetch(
                    "http://127.0.0.1:5000/customers",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            email: email

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to add customer."
                );

            }


            const customerData =
                data.customer;


            /* Create sidebar customer */

            const customer =
                document.createElement(
                    "div"
                );


            customer.className =
                "customer";


            customer.dataset.customerId =
                customerData.id;


            customer.dataset.name =
                customerData.name;


            customer.dataset.email =
                customerData.email;


            customer.innerHTML = `

                <div class="avatar">

                    ${escapeHtml(
                        getInitials(
                            customerData.name
                        )
                    )}

                </div>

                <div class="customer-info">

                    <strong>
                        ${escapeHtml(
                            customerData.name
                        )}
                    </strong>

                    <span>
                        ${escapeHtml(
                            customerData.email
                        )}
                    </span>

                </div>

                <button
                    class="customer-menu"
                    type="button"
                    title="Customer options">
                    ⋮
                </button>

            `;


            customerList.appendChild(
                customer
            );


            setupCustomer(
                customer
            );


            customerSearch.value =
                "";


            noCustomers.style.display =
                "none";


            document
                .querySelectorAll(".customer")
                .forEach(function (item) {

                    item.style.display =
                        "flex";

                });


            closeCustomerModalWindow();


            selectCustomer(
                customer
            );


            console.log(
                "Customer created:",
                customerData
            );


        } catch (error) {

            console.error(
                "Add customer error:",
                error
            );


            alert(
                "Could not add customer.\n\n" +
                error.message
            );


        } finally {

            saveCustomer.disabled =
                false;


            saveCustomer.textContent =
                "Add Customer";

        }

    }
);


/* =========================================================
   CUSTOMER CONTEXT MENU
========================================================= */

function showCustomerContextMenu(
    customer,
    event
) {

    customerContextMenu.style.display =
        "block";


    let x =
        event.clientX;


    let y =
        event.clientY;


    const menuWidth =
        175;


    const menuHeight =
        90;


    if (
        x + menuWidth >
        window.innerWidth
    ) {

        x =
            window.innerWidth -
            menuWidth -
            10;

    }


    if (
        y + menuHeight >
        window.innerHeight
    ) {

        y =
            window.innerHeight -
            menuHeight -
            10;

    }


    customerContextMenu.style.left =
        x + "px";


    customerContextMenu.style.top =
        y + "px";

}


/* =========================================================
   VIEW CUSTOMER
========================================================= */

viewCustomer.addEventListener(
    "click",
    function () {

        if (!selectedCustomerElement) {
            return;
        }


        const name =
            selectedCustomerElement.dataset.name;


        const email =
            selectedCustomerElement.dataset.email;


        alert(
            "Customer\n\n" +
            "Name: " + name +
            "\nEmail: " + email
        );


        customerContextMenu.style.display =
            "none";

    }
);


/* =========================================================
   DELETE CUSTOMER
========================================================= */

deleteCustomer.addEventListener(
    "click",
    function () {

        if (!selectedCustomerElement) {
            return;
        }


        const name =
            selectedCustomerElement.dataset.name;


        const confirmed =
            confirm(
                "Delete " +
                name +
                " from the customer list?"
            );


        if (!confirmed) {
            return;
        }


        const wasActive =
            selectedCustomerElement
                .classList
                .contains("active");


        selectedCustomerElement.remove();


        customerContextMenu.style.display =
            "none";


        selectedCustomerElement =
            null;


        const remainingCustomers =
            document.querySelectorAll(
                ".customer"
            );


        if (
            wasActive &&
            remainingCustomers.length > 0
        ) {

            selectCustomer(
                remainingCustomers[0]
            );

        }


        if (
            remainingCustomers.length === 0
        ) {

            currentCustomerId =
                null;


            conversationTitle.textContent =
                "No Customer";


            conversationAvatar.textContent =
                "--";


            profileEmail.textContent =
                "";


            messages.innerHTML = `

                <div class="welcome-message">

                    <div class="welcome-icon">
                        H
                    </div>

                    <h2>
                        No customers
                    </h2>

                    <p>
                        Add a customer to start
                        a conversation.
                    </p>

                </div>

            `;


            memoryList.innerHTML = `

                <div class="memory-empty">

                    <div class="memory-empty-icon">
                        🧠
                    </div>

                    <h3>
                        No customer selected
                    </h3>

                    <p>
                        Select or add a customer
                        to view their memories.
                    </p>

                </div>

            `;


            memoryCount.textContent =
                "0";

        }

    }
);


/* =========================================================
   CLOSE CONTEXT MENU
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.closest(
                ".customer-menu"
            ) &&
            !event.target.closest(
                ".context-menu"
            )
        ) {

            customerContextMenu.style.display =
                "none";

        }

    }
);


/* =========================================================
   ADD MESSAGE
========================================================= */

function addMessage(
    text,
    sender
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "message-row " +
        (
            sender === "user"
                ? "user"
                : "assistant"
        );


    const message =
        document.createElement(
            "div"
        );


    message.className =
        "message " + sender;


    /*
       Render AI Markdown instead of
       displaying it as plain text.

       This allows tables, bold text,
       lists, and inline code to render.
    */

    message.innerHTML =
        renderMarkdown(text);


    row.appendChild(
        message
    );


    messages.appendChild(
        row
    );


    messages.scrollTop =
        messages.scrollHeight;

}


/* =========================================================
   LOADING MESSAGE
========================================================= */

function addLoadingMessage() {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "message-row assistant";


    row.id =
        "loadingMessage";


    row.innerHTML = `

        <div class="message assistant">

            <div class="loading-message">

                <span class="loading-dot"></span>

                <span class="loading-dot"></span>

                <span class="loading-dot"></span>

                <span>
                    Hindsight is thinking...
                </span>

            </div>

        </div>

    `;


    messages.appendChild(
        row
    );


    messages.scrollTop =
        messages.scrollHeight;

}


function removeLoadingMessage() {

    const loading =
        document.getElementById(
            "loadingMessage"
        );


    if (loading) {

        loading.remove();

    }

}


/* =========================================================
   DISPLAY HINDSIGHT MEMORIES
========================================================= */

function displayMemories(
    memories
) {

    if (
        !memories ||
        memories.length === 0
    ) {

        memoryCount.textContent =
            "0";


        memoryList.innerHTML = `

            <div class="memory-empty">

                <div class="memory-empty-icon">
                    🧠
                </div>

                <h3>
                    No memories found
                </h3>

                <p>
                    No previous relevant memories
                    were retrieved for this message.
                </p>

            </div>

        `;


        return;

    }


    memoryCount.textContent =
        memories.length;


    memoryList.innerHTML =
        "";


    memories.forEach(
        function (memory) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "memory-card";


            const text =
                memory.text || "";


            card.innerHTML = `

                <p>
                    ${escapeHtml(text)}
                </p>

            `;


            memoryList.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   SEND MESSAGE
========================================================= */

async function sendMessage() {

    const message =
        messageInput.value.trim();


    if (!message) {
        return;
    }


    if (!currentCustomerId) {

        alert(
            "Please select a customer first."
        );


        return;

    }


    /* Show user message */

    addMessage(
        message,
        "user"
    );


    /* Clear input */

    messageInput.value =
        "";


    /* Disable */

    sendButton.disabled =
        true;


    /* Loading */

    addLoadingMessage();


    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/chat",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        customer_id:
                            currentCustomerId,

                        message:
                            message,

                        ticket_id:
                            null

                    })

                }
            );


        const data =
            await response.json();


        removeLoadingMessage();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Something went wrong."
            );

        }


        /* AI response */

        addMessage(
            data.response,
            "assistant"
        );


        /* Hindsight memories */

        displayMemories(
            data.memories_used || []
        );


        /*
           Refresh structured customer information
           as well, so the right panel stays current.
        */

        loadCustomerContext(
            currentCustomerId
        );


    } catch (error) {

        removeLoadingMessage();


        addMessage(
            "Sorry, I couldn't process that request. " +
            error.message,
            "assistant"
        );


    } finally {

        sendButton.disabled =
            false;


        messageInput.focus();

    }

}


/* =========================================================
   SEND BUTTON
========================================================= */

sendButton.addEventListener(
    "click",
    sendMessage
);


/* =========================================================
   ENTER TO SEND
========================================================= */

messageInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();


            sendMessage();

        }

    }
);


/* =========================================================
   AUTO RESIZE
========================================================= */

messageInput.addEventListener(
    "input",
    function () {

        this.style.height =
            "auto";


        this.style.height =
            Math.min(
                this.scrollHeight,
                120
            ) + "px";

    }
);

