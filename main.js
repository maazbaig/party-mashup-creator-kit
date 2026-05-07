(function () {
  const config = window.PARTY_MASHUP_CONFIG || {};
  const supabaseKey = config.SUPABASE_PUBLISHABLE_KEY || config.SUPABASE_ANON_KEY;
  const form = document.querySelector("#creator-request-form");
  const status = document.querySelector("#form-status");

  function setStatus(message, isError) {
    status.textContent = message;
    status.style.color = isError ? "#a83224" : "#1c633d";
  }

  function getValue(formData, key) {
    return String(formData.get(key) || "").trim();
  }

  function hasSupabaseConfig() {
    return Boolean(config.SUPABASE_URL && supabaseKey);
  }

  if (!form) {
    return;
  }

  if (!hasSupabaseConfig()) {
    setStatus("Add website/config.js with your Supabase URL and publishable key to enable this form.", false);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    if (getValue(formData, "website")) {
      form.reset();
      setStatus("Thanks. Your request was received.", false);
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!hasSupabaseConfig()) {
      setStatus("Supabase is not configured yet. Add website/config.js before collecting requests.", true);
      return;
    }

    if (!window.supabase || !window.supabase.createClient) {
      setStatus("Supabase client could not load. Check your connection and try again.", true);
      return;
    }

    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    button.textContent = "Sending...";
    setStatus("", false);

    const payload = {
      name: getValue(formData, "name"),
      email: getValue(formData, "email"),
      channel_url: getValue(formData, "channel_url"),
      platform: getValue(formData, "platform"),
      audience_size: getValue(formData, "audience_size"),
      request_type: getValue(formData, "request_type"),
      message: getValue(formData, "message"),
      source_page: window.location.href,
      referrer: document.referrer || "",
      user_agent: navigator.userAgent || "",
      metadata: {
        language: navigator.language || "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || ""
      }
    };

    try {
      const client = window.supabase.createClient(config.SUPABASE_URL, supabaseKey);
      const result = await client.from("creator_requests").insert(payload);

      if (result.error) {
        throw result.error;
      }

      form.reset();
      setStatus("Thanks. Your request was received.", false);
    } catch (error) {
      setStatus("The request could not be sent. Please try again later.", true);
      console.error(error);
    } finally {
      button.disabled = false;
      button.textContent = "Send Request";
    }
  });
})();
