**Syntax Naming Suggestions** for Formique form SDL (Schema Definition Language)

<!--

### **Submit Mode Naming Conventions**
| Use Case               | Suggested `submitMode` Name | Notes                                                                 |
|------------------------|----------------------------|-----------------------------------------------------------------------|
| **Generic API Submit** | `fa` (Formique API)        | Short, memorable, and aligns with `Formique`.                         |
| **Login Auth**         | `auth`                     | Clear purpose (handles login/logout).                                 |
| **Registration**       | `register`                 | Explicit for sign-ups.                                                |
| **Contact Forms**      | `cloud`                    | Uses Formique's cloud endpoint.                                       |
| **RSVP/Events**       | `rsvp`                     | Semantic for event responses.                                         |
| **Traditional POST**   | `post`                     | Fallback for non-API forms.                                           |


### **Parameter Names**
| Purpose                     | Suggested Syntax               | Example                                   |
|-----------------------------|--------------------------------|-------------------------------------------|
| **Form Action URL**         | `formAction`                   | `formAction: "/submit"`                   |
| **Cloud Endpoint Override** | `cloudEndpoint`                | `cloudEndpoint: "https://cloud.formique.app/rsvp"` |
| **HTTP Method**             | `method`                       | `method: "PUT"` (default: `POST`)         |
| **Auto-Submit Handling**    | `submitOnPage: true/false`     | `submitOnPage: true` (default)            |



### **Example SDL Configs**
#### 1. **Contact Form (Cloud Submit)**
```javascript
const features = {
  submitMode: "cloud", // Uses Formique's cloud endpoint
  formAction: "/fallback-local-submit", // Optional fallback
  submitOnPage: true
};
```

#### 2. **Login Form (Auth)**
```javascript
const features = {
  submitMode: "auth",
  formAction: "/login",
  method: "POST",
  redirectURL: "/dashboard" // Redirect on success
};
```

#### 3. **RSVP (Cloud Endpoint)**
```javascript
const features = {
  submitMode: "rsvp",
  cloudEndpoint: "https://cloud.formique.app/events", // Overrides formAction
  submitOnPage: true
};
```

#### 4. **Generic API (FA Mode)**
```javascript
const features = {
  submitMode: "fa", // Formique API (JSON)
  formAction: "/api/submit",
  method: "POST"
};
```

### **Why These Names?**
1. **Consistency**:  
   - Prefix `fa` for Formique-specific features.  
   - Semantic names (`auth`, `rsvp`) for clarity.  

2. **Flexibility**:  
   - `cloudEndpoint` overrides `formAction` when using Formique Cloud.  
   - `submitOnPage` works across all modes.  

3. **Developer-Friendly**:  
   - Short (`fa`, `auth`) for quick typing.  
   - No ambiguity between `formAction` (local) vs. `cloudEndpoint` (Formique Cloud).  


### **Edge Cases Handled**
- If `submitMode: "cloud"` but no `cloudEndpoint` is provided:  
  Falls back to `formAction` with a warning.  
- If `submitMode: "auth"` and no `redirectURL`:  
  Shows a success message instead of redirecting.  


### **Suggested Defaults**
```javascript
this.formSettings = {
  submitMode: "POST", // Default: traditional form POST
  formAction: "",
  method: "POST",
  submitOnPage: true,
  redirectURL: null
};
```
-->
