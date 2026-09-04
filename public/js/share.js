document.addEventListener("DOMContentLoaded", () => {

    const shareButton = document.getElementById("shareNoteBtn");
    const shareModal = document.getElementById("shareModal");
    const shareModalOverlay = document.getElementById("shareModalOverlay");
    const shareModalClose = document.getElementById("shareModalClose");

    const copyButton = document.getElementById("copyShareLinkBtn");
    const shareUrlInput = document.getElementById("shareNoteUrl");
    const copySuccess = document.getElementById("shareCopySuccess");

    const nativeShareButton = document.getElementById("nativeShareBtn");

    const whatsappButton = document.getElementById("shareWhatsApp");
    const telegramButton = document.getElementById("shareTelegram");
    const emailButton = document.getElementById("shareEmail");
    const facebookButton = document.getElementById("shareFacebook");
    const xButton = document.getElementById("shareX");


    // If this page doesn't contain the share feature,
    // stop execution.
    if (!shareButton || !shareModal) {
        return;
    }


    // ---------------------------------------------------------
    // Note information
    // ---------------------------------------------------------

    const noteUrl = window.location.href;
    const noteTitle = shareButton.dataset.noteTitle;
    const noteDescription = shareButton.dataset.noteDescription;


    const shareText =
        `Check out this note on UniNotes: ${noteTitle}`;


    // ---------------------------------------------------------
    // Open Modal
    // ---------------------------------------------------------

    function openShareModal() {

        shareUrlInput.value = noteUrl;

        shareModal.classList.add("active");
        shareModal.setAttribute("aria-hidden", "false");

        document.body.classList.add("share-modal-open");

        updateShareLinks();

        setTimeout(() => {
            shareModalClose?.focus();
        }, 50);
    }


    // ---------------------------------------------------------
    // Close Modal
    // ---------------------------------------------------------

    function closeShareModal() {

        shareModal.classList.remove("active");
        shareModal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("share-modal-open");

        copySuccess.classList.remove("show");
    }


    // ---------------------------------------------------------
    // Update Social Links
    // ---------------------------------------------------------

    function updateShareLinks() {

        const encodedUrl = encodeURIComponent(noteUrl);
        const encodedText = encodeURIComponent(shareText);


        // WhatsApp
        whatsappButton.href =
            `https://wa.me/?text=${encodedText}%20${encodedUrl}`;


        // Telegram
        telegramButton.href =
            `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;


        // Email
        emailButton.href =
            `mailto:?subject=${encodeURIComponent(
                noteTitle + " - UniNotes"
            )}&body=${encodeURIComponent(
                shareText + "\n\n" + noteUrl
            )}`;


        // Facebook
        facebookButton.href =
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;


        // X
        xButton.href =
            `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    }


    // ---------------------------------------------------------
    // Copy Link
    // ---------------------------------------------------------

    async function copyShareLink() {

        try {

            if (navigator.clipboard) {

                await navigator.clipboard.writeText(noteUrl);

            } else {

                shareUrlInput.select();
                document.execCommand("copy");

            }


            copySuccess.classList.add("show");

            copyButton.innerHTML =
                `<i class="fa-solid fa-check"></i>
                 <span>Copied</span>`;


            setTimeout(() => {

                copySuccess.classList.remove("show");

                copyButton.innerHTML =
                    `<i class="fa-regular fa-copy"></i>
                     <span>Copy</span>`;

            }, 2000);


        } catch (error) {

            console.error("Unable to copy link:", error);

            shareUrlInput.select();

        }
    }


    // ---------------------------------------------------------
    // Native Share
    // ---------------------------------------------------------

    async function nativeShare() {

        if (!navigator.share) {

            await copyShareLink();

            return;

        }


        try {

            await navigator.share({

                title: `${noteTitle} - UniNotes`,

                text: shareText,

                url: noteUrl

            });

        } catch (error) {

            // AbortError means the user simply closed
            // the native share sheet.
            if (error.name !== "AbortError") {

                console.error(
                    "Native sharing failed:",
                    error
                );

            }

        }

    }


    // ---------------------------------------------------------
    // Event Listeners
    // ---------------------------------------------------------

    shareButton.addEventListener(
        "click",
        openShareModal
    );


    shareModalClose.addEventListener(
        "click",
        closeShareModal
    );


    shareModalOverlay.addEventListener(
        "click",
        closeShareModal
    );


    copyButton.addEventListener(
        "click",
        copyShareLink
    );


    nativeShareButton.addEventListener(
        "click",
        nativeShare
    );


    // ---------------------------------------------------------
    // Escape key
    // ---------------------------------------------------------

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            shareModal.classList.contains("active")
        ) {

            closeShareModal();

        }

    });

});