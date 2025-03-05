// import Smooch from "smooch";

(function () {
  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '300px' });
  client.metadata().then(function (metadata) {
    console.log("metadata found");
    var integrationId = metadata.settings.sunco_integration_id;
    !function (o, p, s, e, c) {
      var i, a, h, u = [], d = []; function t() { var t = "You must provide a supported major version."; try { if (!c) throw new Error(t); var e, n = "https://cdn.smooch.io/", r = "smooch"; if ((e = "string" == typeof this.response ? JSON.parse(this.response) : this.response).url) { var o = p.getElementsByTagName("script")[0], s = p.createElement("script"); s.async = !0; var i = c.match(/([0-9]+).?([0-9]+)?.?([0-9]+)?/), a = i && i[1]; if (i && i[3]) s.src = n + r + "." + c + ".min.js"; else { if (!(4 <= a && e["v" + a])) throw new Error(t); s.src = e["v" + a] } o.parentNode.insertBefore(s, o) } } catch (e) { e.message === t && console.error(e) } } o[s] = { init: function () { i = arguments; var t = { then: function (e) { return d.push({ type: "t", next: e }), t }, catch: function (e) { return d.push({ type: "c", next: e }), t } }; return t }, on: function () { u.push(arguments) }, render: function () { a = arguments }, destroy: function () { h = arguments } }, o.__onWebMessengerHostReady__ = function (e) { if (delete o.__onWebMessengerHostReady__, o[s] = e, i) for (var t = e.init.apply(e, i), n = 0; n < d.length; n++) { var r = d[n]; t = "t" === r.type ? t.then(r.next) : t.catch(r.next) } a && e.render.apply(e, a), h && e.destroy.apply(e, h); for (n = 0; n < u.length; n++)e.on.apply(e, u[n]) }; var n = new XMLHttpRequest; n.addEventListener("load", t), n.open("GET", "https://" + e + ".webloader.smooch.io/", !0), n.responseType = "json", n.send()
    }(window, document, "Smooch", integrationId, "5");


 //   document.addEventListener("DOMContentLoaded", function (event) {

      /** Create a new Smooch conversation */
      const createConversation = (message) => {
        Smooch.createConversation({

        }).then((conversation) => {
          window.localStorage.setItem("smooch_conversation_id", conversation.id);
          Smooch.sendMessage(message, conversation.id);
        });
      };

      /**
       * Send message if conversation exists, or create a new one.
       * @param {*} message
       */
      const sendMessage = (message) => {
        Smooch.getConversationById(
          window.localStorage.getItem("smooch_conversation_id")
        )
          .then((conversation) => {
            if (conversation) {
              Smooch.sendMessage(message, conversation.id);
            } else {
              createConversation(message);
            }
          })
          .catch((err) => createConversation(message));
      };

      /**
       * Render a new chat bubble or status message
       * @param {*} message
       * @param {*} type
       * @param {*} author
       */
      const displayMessage = (message, type) => {
        const node = document.createElement("div");
        if (type === "status") {
          node.className = "status-message";
        } else {
          node.classList.add("message");
        }
        node.innerHTML = message;
        const placeholder = document.getElementById("placeholder");
        const title = document.getElementById("suggestion-title");
        const btnUse = document.getElementById("btn-use-response");
        const btnAsk = document.getElementById("btn-ask-ada");
        const chat = document.getElementById("chat");
        
        placeholder.classList.add("hidden");
        btnAsk.classList.add("hidden");
        title.classList.remove("hidden");
        btnUse.classList.remove("hidden");
        
        chat.appendChild(node);
        chat.scrollTop = chat.scrollHeight;
      };

      /**
       * Handle incoming messages from Smooch
       */
      Smooch.on("message:received", (message, data) => {
        console.log(
          `The user received a message in conversation ${window.localStorage.getItem(
            "smooch_conversation_id"
          )}: `,
          message
        );

        if (message.text && message.text.length > 0) {
          displayMessage(message.text, message.type, "business");
        }

      });

      /**
       * Callback when a message is sent successfully
       */
      Smooch.on("message:sent", (message, data) => {
        console.log(
          `The user sent a message in conversation ${window.localStorage.getItem(
            "smooch_conversation_id"
          )}: `,
          message
        );
      });

      /**
       * Send a hello message when there is no conversation.
       */
      Smooch.on("ready", () => {
        console.log("Smooch ready");

        /**
         * Bind chat box input handler
         */
        const askButton = document.getElementById("btn-ask-ada");
        askButton.addEventListener("click", (event) => {
          console.log("askButton clicked");
          client.get('ticket.conversation').then(function (data) {

            console.log(data);
            const messages = data["ticket.conversation"] || [];
            // Format messages into a human-readable conversation string
            const conversationText = messages
              .map(msg => {
                const role = msg.author.role === 'end-user' ? 'Customer' : 'Agent';
                const content = msg.message.content || '';

                // Strip HTML if present
                const temp = document.createElement('div');
                temp.innerHTML = content;
                const cleanContent = temp.textContent || temp.innerText || '';

                return cleanContent;
              })
              .join('\n');


            sendMessage(conversationText);
          });
        });


        const useResponseButton = document.getElementById("btn-use-response");
        useResponseButton.addEventListener("click", (event) => {
          console.log("useResponseButton clicked");
          const response = document.getElementsByClassName("message")[0];
          client.invoke('ticket.editor.insert', response.innerText).then(function (data) {
            console.log("added response")
          });
        });

      });

      Smooch.init({
        embedded: true,
        integrationId: integrationId
      });

      /**
       * Call Smooch when ready
       */
      Smooch.render(document.getElementById("smooch-render"));
//    });
  });

})();