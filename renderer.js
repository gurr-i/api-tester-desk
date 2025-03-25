import storage from "./storage.js";

// Helper functions for response formatting
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatJSON(obj) {
  const json = JSON.stringify(obj, null, 2);
  return escapeHtml(json)
    .split('\n')
    .map((line, i) => `<span class="line-number">${i + 1}</span>${line}`)
    .join('\n');
}

function formatXML(xml) {
  const formatted = xml
    .replace(/>/g, '>&newline;')
    .replace(/</g, '&newline;<')
    .replace(/&newline;&newline;/g, '&newline;')
    .split('&newline;')
    .filter(line => line.trim())
    .map((line, i) => `<span class="line-number">${i + 1}</span>${escapeHtml(line.trim())}`)
    .join('\n');
  return formatted;
}

document.addEventListener('DOMContentLoaded', () => {
    // Copy All Response functionality
    document.getElementById('copyAllResponse').addEventListener('click', async () => {
        const button = document.getElementById('copyAllResponse');
        const originalText = button.innerHTML;
        const headers = document.querySelectorAll('.header-item');
        const responseBody = document.querySelector('.response-container pre');
        
        let textToCopy = '';
        
        // Add headers
        headers.forEach(header => {
            const key = header.querySelector('.header-key').textContent;
            const value = header.querySelector('.header-value').textContent;
            textToCopy += `${key}${value}\n`;
        });
        
        // Add response body
        if (responseBody) {
            textToCopy += '\n' + responseBody.textContent;
        }
        
        try {
            await navigator.clipboard.writeText(textToCopy);
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check me-1" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>Copied!';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle me-1" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>Failed';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        }
    });
  // Theme toggle functionality
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDarkMode = body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    
    // Update theme toggle icon
    themeToggle.innerHTML = isDarkMode ? 
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-stars" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162z"/></svg>' :
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>';
  });

  // Initialize theme toggle icon based on saved theme
  if (savedTheme === "dark") {
    themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-stars" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162z"/></svg>';
  }

  const apiForm = document.getElementById("apiForm");
  const methodSelect = document.getElementById("method");
  const urlInput = document.getElementById("url");
  const headersContainer = document.getElementById("headers");
  const addHeaderBtn = document.getElementById("addHeader");
  const requestBodyTextarea = document.getElementById("requestBody");
  const statusElement = document.getElementById("status");
  const responseHeadersElement = document.getElementById("responseHeaders");
  const responseBodyElement = document.getElementById("responseBody");

  // Initialize UI elements for history, collections, and environments
  const historyList = document.getElementById("historyList");
  const clearHistoryBtn = document.getElementById("clearHistory");
  const collectionsList = document.getElementById("collectionsList");
  const addCollectionBtn = document.getElementById("addCollection");
  const environmentsList = document.getElementById("environmentsList");
  const addEnvironmentBtn = document.getElementById("addEnvironment");
  const activeEnvironmentSelect = document.getElementById("activeEnvironment");

  function addHeaderRow(key = "", value = "") {
    const row = document.createElement("div");
    row.className = "row mb-2";
    row.innerHTML = `
            <div class="col-5">
                <input type="text" class="form-control" placeholder="Key" value="${key}">
            </div>
            <div class="col-5">
                <input type="text" class="form-control" placeholder="Value" value="${value}">
            </div>
            <div class="col-2">
                <button type="button" class="btn btn-outline-danger w-100">Remove</button>
            </div>
        `;

    const removeBtn = row.querySelector("button");
    removeBtn.addEventListener("click", () => row.remove());

    headersContainer.appendChild(row);
  }

  // Load and display history
  function displayHistory() {
    const history = storage.getHistory();
    historyList.innerHTML = history
      .map(
        (item) => `
            <div class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="mb-1">${item.method} ${item.url}</h6>
                    <small>${new Date(item.timestamp).toLocaleString()}</small>
                </div>
                <p class="mb-1">Status: <span class="status-code ${item.response?.status >= 500 ? 'status-5xx' : item.response?.status >= 400 ? 'status-4xx' : item.response?.status >= 300 ? 'status-3xx' : 'status-2xx'}">${item.response?.status || "N/A"}</span></p>
                <button class="btn btn-sm btn-outline-primary load-request" data-request-id="${
                  item.id
                }">Load Request</button>
            </div>
        `
      )
      .join("");

    // Add event listeners to load request buttons
    historyList.querySelectorAll(".load-request").forEach((btn) => {
      btn.addEventListener("click", () => {
        const requestId = btn.dataset.requestId;
        const request = history.find((item) => item.id === parseInt(requestId));
        if (request) {
          methodSelect.value = request.method;
          urlInput.value = request.url;
          requestBodyTextarea.value = request.body
            ? JSON.stringify(request.body, null, 2)
            : "";

          // Clear existing headers
          headersContainer.innerHTML = "";
          // Add saved headers
          Object.entries(request.headers || {}).forEach(([key, value]) => {
            addHeaderRow(key, value);
          });
        }
      });
    });
  }

  // Load and display environments
  function displayEnvironments() {
    const environments = storage.getAllEnvironments();
    const envNames = Object.keys(environments);

    // Update environment selector
    activeEnvironmentSelect.innerHTML =
      '<option value="">No Environment</option>' +
      envNames
        .map((name) => `<option value="${name}">${name}</option>`)
        .join("");

    // Display environment variables
    environmentsList.innerHTML = envNames
      .map(
        (name) => `
            <div class="card mb-3">
                <div class="card-body">
                    <h6 class="card-title d-flex justify-content-between align-items-center">
                        ${name}
                        <button class="btn btn-sm btn-outline-danger delete-env" data-env-name="${name}">Delete</button>
                    </h6>
                    <div class="env-variables">
                        ${Object.entries(environments[name])
                          .map(
                            ([key, value]) => `
                            <div class="row mb-2">
                                <div class="col-5">
                                    <input type="text" class="form-control form-control-sm" value="${key}" readonly>
                                </div>
                                <div class="col-7">
                                    <input type="text" class="form-control form-control-sm" value="${value}" readonly>
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        `
      )
      .join("");

    // Add event listeners for environment deletion
    environmentsList.querySelectorAll(".delete-env").forEach((btn) => {
      btn.addEventListener("click", () => {
        const envName = btn.dataset.envName;
        storage.deleteEnvironment(envName);
        displayEnvironments();
      });
    });
  }

  // Add new environment
  addEnvironmentBtn.addEventListener("click", () => {
    const name = prompt("Enter environment name:");
    if (name) {
      const variables = {};
      let addMore = true;
      while (addMore) {
        const key = prompt("Enter variable name:");
        if (key) {
          const value = prompt(`Enter value for ${key}:`);
          if (value) variables[key] = value;
        }
        addMore = confirm("Add another variable?");
      }
      storage.addEnvironment(name, variables);
      displayEnvironments();
    }
  });

  // Clear history
  clearHistoryBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all history?")) {
      storage.clearHistory();
      displayHistory();
    }
  });

  // Replace environment variables in string
  function replaceEnvironmentVariables(str) {
    const activeEnv = activeEnvironmentSelect.value;
    if (!activeEnv) return str;

    const variables = storage.getEnvironment(activeEnv);
    return str.replace(
      /\{\{([^}]+)\}\}/g,
      (match, key) => variables[key] || match
    );
  }

  addHeaderBtn.addEventListener("click", () => addHeaderRow());

  apiForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect headers
    const headers = {};
    headersContainer.querySelectorAll(".row").forEach((row) => {
      const keyInput = row.querySelector("input:first-child");
      const valueInput = row.querySelector("input:nth-child(2)");
      if (keyInput.value) {
        headers[keyInput.value] = replaceEnvironmentVariables(valueInput.value);
      }
    });

    // Replace environment variables in URL
    const processedUrl = replaceEnvironmentVariables(urlInput.value);

    // Prepare request options
    const options = {
      method: methodSelect.value,
      headers: headers,
    };

    // Add body for non-GET requests
    if (methodSelect.value !== "GET" && requestBodyTextarea.value) {
      try {
        const processedBody = replaceEnvironmentVariables(
          requestBodyTextarea.value
        );
        options.body = JSON.parse(processedBody);
      } catch (error) {
        alert("Invalid JSON in request body");
        return;
      }
    }

    try {
      statusElement.textContent = "Loading...";
      responseHeadersElement.textContent = "";
      responseBodyElement.textContent = "";

      // Initialize timing metrics
      const timingMetrics = {
        startTime: performance.now(),
        dnsStart: 0,
        dnsEnd: 0,
        tcpStart: 0,
        tcpEnd: 0,
        tlsStart: 0,
        tlsEnd: 0,
        ttfbStart: 0,
        ttfbEnd: 0,
        downloadStart: 0,
        downloadEnd: 0
      };

      // Create a PerformanceObserver to monitor resource timing
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const entry = entries[entries.length - 1];
        
        if (entry) {
          timingMetrics.dnsEnd = entry.domainLookupEnd - entry.domainLookupStart;
          timingMetrics.tcpEnd = entry.connectEnd - entry.connectStart;
          timingMetrics.tlsEnd = entry.secureConnectionStart > 0 ? 
            entry.connectEnd - entry.secureConnectionStart : 0;
          timingMetrics.ttfbEnd = entry.responseStart - entry.requestStart;
          timingMetrics.downloadEnd = entry.responseEnd - entry.responseStart;

          // Update timing display
          document.getElementById('dnsTime').textContent = `${timingMetrics.dnsEnd.toFixed(2)}ms`;
          document.getElementById('tcpTime').textContent = `${timingMetrics.tcpEnd.toFixed(2)}ms`;
          document.getElementById('tlsTime').textContent = `${timingMetrics.tlsEnd.toFixed(2)}ms`;
          document.getElementById('ttfbTime').textContent = `${timingMetrics.ttfbEnd.toFixed(2)}ms`;
          document.getElementById('downloadTime').textContent = `${timingMetrics.downloadEnd.toFixed(2)}ms`;
          document.getElementById('totalTime').textContent = 
            `${(entry.duration).toFixed(2)}ms`;

          // Update timing bars
          const totalDuration = entry.duration;
          const barWidth = document.querySelector('.timing-bar').offsetWidth;

          document.querySelector('.timing-phase.dns').style.width = 
            `${(timingMetrics.dnsEnd / totalDuration) * 100}%`;
          document.querySelector('.timing-phase.tcp').style.left = 
            `${(entry.connectStart - entry.startTime) / totalDuration * 100}%`;
          document.querySelector('.timing-phase.tcp').style.width = 
            `${timingMetrics.tcpEnd / totalDuration * 100}%`;
          document.querySelector('.timing-phase.tls').style.left = 
            `${(entry.secureConnectionStart - entry.startTime) / totalDuration * 100}%`;
          document.querySelector('.timing-phase.tls').style.width = 
            `${timingMetrics.tlsEnd / totalDuration * 100}%`;
          document.querySelector('.timing-phase.ttfb').style.left = 
            `${(entry.requestStart - entry.startTime) / totalDuration * 100}%`;
          document.querySelector('.timing-phase.ttfb').style.width = 
            `${timingMetrics.ttfbEnd / totalDuration * 100}%`;
          document.querySelector('.timing-phase.download').style.left = 
            `${(entry.responseStart - entry.startTime) / totalDuration * 100}%`;
          document.querySelector('.timing-phase.download').style.width = 
            `${timingMetrics.downloadEnd / totalDuration * 100}%`;
        }
      });

      observer.observe({ entryTypes: ['resource'] });
      const response = await fetch(processedUrl, options);

      // Display status with color coding
      const statusCode = response.status;
      const statusClass = statusCode >= 500 ? 'status-5xx' :
                         statusCode >= 400 ? 'status-4xx' :
                         statusCode >= 300 ? 'status-3xx' :
                         'status-2xx';
      statusElement.className = `status-code ${statusClass}`;
      statusElement.textContent = `${statusCode} ${response.statusText}`;

      // Check if response is an image
      const responseContentType = response.headers.get('content-type');
      const imagePreviewElement = document.getElementById('imagePreview');
      const previewImageElement = document.getElementById('previewImage');
      
      if (responseContentType && responseContentType.startsWith('image/')) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        previewImageElement.src = imageUrl;
        imagePreviewElement.style.display = 'block';
      } else {
        imagePreviewElement.style.display = 'none';
        previewImageElement.src = '';
      }

      // Display headers with formatting
      const headerText = Array.from(response.headers.entries())
        .map(([key, value]) => `<div class="header-item"><span class="header-key">${key}:</span> <span class="header-value">${value}</span></div>`)
        .join("");
      responseHeadersElement.innerHTML = headerText;

      // Add format headers button if it doesn't exist
      if (!responseHeadersElement.parentElement.querySelector('.format-btn')) {
        const formatHeadersBtn = document.createElement('button');
        formatHeadersBtn.className = 'btn btn-sm btn-outline-secondary format-btn';
        formatHeadersBtn.textContent = 'Format Headers';
        formatHeadersBtn.onclick = () => {
          try {
            const headersObj = Object.fromEntries(response.headers.entries());
            responseHeadersElement.innerHTML = `<pre>${JSON.stringify(headersObj, null, 2)}</pre>`;
          } catch (error) {
            console.error('Error formatting headers:', error);
          }
        };
        responseHeadersElement.parentElement.insertBefore(formatHeadersBtn, responseHeadersElement);
      }

      // Get content type
      const contentType = response.headers.get('content-type') || '';
      
      // Display body with appropriate formatting
      const responseBody = await response.text();
      const responseSize = new Blob([responseBody]).size;
      
      // Add response size info
      const sizeInfo = `<div class="response-size">Size: ${formatSize(responseSize)}</div>`;
      
      try {
        if (contentType.includes('application/json')) {
          // Format JSON response
          const jsonBody = JSON.parse(responseBody);
          responseBodyElement.innerHTML = sizeInfo + `<div class="json-response">${formatJSON(jsonBody)}</div>`;
        } else if (contentType.includes('text/html')) {
          // Format HTML response
          responseBodyElement.innerHTML = sizeInfo + `<div class="html-response">${escapeHtml(responseBody)}</div>`;
        } else if (contentType.includes('text/xml') || contentType.includes('application/xml')) {
          // Format XML response
          responseBodyElement.innerHTML = sizeInfo + `<div class="xml-response">${formatXML(responseBody)}</div>`;
        } else {
          // Plain text response
          responseBodyElement.innerHTML = sizeInfo + `<div class="text-response">${escapeHtml(responseBody)}</div>`;
        }
      } catch (error) {
        responseBodyElement.innerHTML = sizeInfo + `<div class="text-response">${escapeHtml(responseBody)}</div>`;
      }

      // Add copy button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn btn-sm btn-outline-secondary copy-btn';
      copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(responseBody);
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>';
        setTimeout(() => {
          copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>';
        }, 2000);
      };
      responseBodyElement.parentElement.insertBefore(copyBtn, responseBodyElement);


      // Generate code snippets
      const snippetLanguage = document.getElementById('snippetLanguage');
      const codeSnippet = document.getElementById('codeSnippet');
      const copySnippetBtn = document.getElementById('copySnippet');

      function generateCurlSnippet() {
        let curl = `curl -X ${methodSelect.value} "${processedUrl}"`;
        
        // Add headers
        Object.entries(headers).forEach(([key, value]) => {
          curl += ` \
  -H "${key}: ${value}"`;
        });

        // Add request body
        if (methodSelect.value !== 'GET' && requestBodyTextarea.value) {
          curl += ` \
  -d '${requestBodyTextarea.value}'`;
        }

        return curl;
      }

      function generateAxiosSnippet() {
        const config = {
          method: methodSelect.value.toLowerCase(),
          url: processedUrl,
          headers: headers
        };

        if (methodSelect.value !== 'GET' && requestBodyTextarea.value) {
          config.data = requestBodyTextarea.value;
        }

        return `axios(${JSON.stringify(config, null, 2)})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });`;
      }

      function generateFetchSnippet() {
        const options = {
          method: methodSelect.value,
          headers: headers
        };

        if (methodSelect.value !== 'GET' && requestBodyTextarea.value) {
          options.body = requestBodyTextarea.value;
        }

        return `fetch("${processedUrl}", ${JSON.stringify(options, null, 2)})
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });`;
      }

      function generatePythonSnippet() {
        let code = `import requests

`;
        
        if (methodSelect.value !== 'GET' && requestBodyTextarea.value) {
          code += `data = ${requestBodyTextarea.value}
`;
        }
        
        code += `headers = ${JSON.stringify(headers, null, 2)}

`;
        code += `response = requests.${methodSelect.value.toLowerCase()}(
    "${processedUrl}",
    headers=headers${methodSelect.value !== 'GET' && requestBodyTextarea.value ? ',\n    json=data' : ''}
)

print(response.json())`;

        return code;
      }

      function updateCodeSnippet() {
        const language = snippetLanguage.value;
        let code = '';

        switch (language) {
          case 'curl':
            code = generateCurlSnippet();
            break;
          case 'axios':
            code = generateAxiosSnippet();
            break;
          case 'fetch':
            code = generateFetchSnippet();
            break;
          case 'python':
            code = generatePythonSnippet();
            break;
        }

        codeSnippet.textContent = code;
      }

      // Add event listeners for code snippet generation
      snippetLanguage.addEventListener('change', updateCodeSnippet);
      copySnippetBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codeSnippet.textContent);
        copySnippetBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg> Copied!';
        setTimeout(() => {
          copySnippetBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg> Copy';
        }, 2000);
      });

      // Generate initial code snippet
      updateCodeSnippet();

      // Save to history
      storage.addToHistory({
        method: methodSelect.value,
        url: urlInput.value,
        headers,
        body: options.body,
        response: {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseBodyElement.textContent,
        },
      });
      displayHistory();
    } catch (error) {
      statusElement.textContent = "Error";
      responseBodyElement.textContent = error.message;
    }
  });

  // Initialize displays
  displayHistory();
  displayEnvironments();
});
