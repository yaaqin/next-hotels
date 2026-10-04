import { GuideCategory } from "./types";

// English — same categories, topic ids, and order as idn.ts
const eng: GuideCategory[] = [
    {
        id: "start",
        title: "Getting started",
        topics: [
            {
                id: "login",
                title: "Sign in with Google",
                summary: "Your Google account is used to book rooms, order food, and manage your orders.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "You can browse rooms and prices without signing in.",
                            "When you continue to the reservation or food checkout, click the \"Masuk dengan Google\" (Sign in with Google) button.",
                            "Choose your Google account. Your name and email are filled in automatically.",
                        ],
                    },
                    {
                        type: "note",
                        text: "All bookings, credit, and food orders are saved to the Google account you sign in with. Use the same account every time.",
                    },
                ],
            },
            {
                id: "language-currency",
                title: "Change language & currency",
                summary: "Show the website in your preferred language and currency.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Click the \"Menu\" button at the top of the page.",
                            "Choose a language: Bahasa Indonesia, English, 日本語, or 中文.",
                            "Choose a display currency: IDR, USD, SGD, JPY, or CNY.",
                        ],
                    },
                    {
                        type: "warning",
                        text: "Prices in currencies other than Rupiah are estimates. You are always charged in Indonesian Rupiah (IDR), and you will see the Rupiah amount to confirm before paying.",
                    },
                ],
            },
        ],
    },
    {
        id: "booking",
        title: "Booking a room",
        topics: [
            {
                id: "booking-search",
                title: "Find a room & choose dates",
                summary: "The main way to book. Lets you stay more than one night and pick a branch.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Open the Hotels page (the \"Semua Cabang\" link at the bottom of the home page), or go straight to the branch you want.",
                            "Fill in the Check-in and Check-out dates, then click \"Check availability\".",
                            "Only rooms that are free on every night of your stay are shown. Sort by price or room number if you like.",
                            "Click \"View room\" to see photos, facilities, and the total price for your dates.",
                            "Click \"Reserve now\" to continue to the reservation page.",
                        ],
                    },
                    {
                        type: "tip",
                        text: "Prices can differ per night (for example on weekends or during promos). The total shown already adds up the price of each night.",
                    },
                ],
                cta: { label: "Find a room", href: "/hotel" },
            },
            {
                id: "booking-quick",
                title: "Quick booking from the home page",
                summary: "Book straight from the \"Booking\" button on the home page.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "On the home page, click the \"Booking\" button at the top.",
                            "On the calendar, click your check-in date and then your check-out date. The number of nights is shown automatically.",
                            "Enter the number of guests (optional), then click \"Reserve\".",
                            "Pick an available room type, then click \"Reserve Now\".",
                        ],
                    },
                    {
                        type: "note",
                        text: "You can still change the dates on the room type list by clicking the dates at the top. Quick booking uses the main branch. To choose another branch, use \"Find a room & choose dates\".",
                    },
                ],
            },
            {
                id: "booking-reservation",
                title: "Fill in the reservation & pick rooms",
                summary: "Complete guest details, choose room numbers, and select a payment method.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Check the Check-in and Check-out dates in the \"Stay\" section.",
                            "Choose a room number. Rooms already booked by someone else on those dates are not listed.",
                            "Sign in with Google if you haven't yet.",
                            "Fill in your full name, phone number (choose the country code), ID type (KTP, Passport, or SIM), and ID number.",
                            "Choose a payment method. See the Payment section for details on each method.",
                            "Review the price summary on the right, then click \"Confirm & Pay\".",
                        ],
                    },
                    {
                        type: "list",
                        title: "Form rules",
                        items: [
                            "A KTP (Indonesian ID card) number must be 16 digits.",
                            "Passport numbers may contain letters and numbers.",
                            "Enter your phone number without the leading 0, since the country code is already selected.",
                        ],
                    },
                ],
            },
            {
                id: "booking-multi-room",
                title: "Book more than one room",
                summary: "Book several rooms for the same dates in a single booking.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "On the reservation page, open the room number picker.",
                            "Tick every room you want. Click a room again to remove it.",
                            "The price summary shows each room's price and adds up the total automatically.",
                            "Continue to payment as usual. All rooms are paid in one bill.",
                        ],
                    },
                    {
                        type: "warning",
                        text: "Bookings with more than one room can't be rescheduled yet. If you need to change dates, cancel and book again.",
                    },
                    {
                        type: "note",
                        text: "For now, all rooms in one booking must be the same room type.",
                    },
                ],
            },
        ],
    },
    {
        id: "payment",
        title: "Payment",
        topics: [
            {
                id: "payment-overview",
                title: "Payment deadline",
                summary: "What to know before choosing a payment method.",
                blocks: [
                    {
                        type: "list",
                        items: [
                            "Virtual Account and QRIS bills are valid for 15 minutes after you click \"Confirm & Pay\".",
                            "Your rooms are held for you until then. After 15 minutes the booking expires automatically and the rooms are released.",
                            "The payment page updates by itself once your payment is received, so there's no need to refresh.",
                            "Methods that aren't available at that branch are shown crossed out and marked \"(unavailable)\".",
                        ],
                    },
                    {
                        type: "warning",
                        text: "Don't pay a bill that has already expired. Make a new booking instead.",
                    },
                ],
            },
            {
                id: "payment-va",
                title: "Virtual Account (BCA, BNI, BRI, Mandiri)",
                summary: "Transfer to a Virtual Account number using mobile banking, internet banking, or an ATM.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Choose \"Virtual Account\", then choose your bank.",
                            "Click \"Confirm & Pay\". You'll be taken to the payment page.",
                            "Copy the Virtual Account number. For Mandiri, copy the Biller Code and Bill Key.",
                            "Pay before the time shown under \"Pay before\".",
                            "Once your payment is received, the page shows a success status automatically.",
                        ],
                    },
                    {
                        type: "steps",
                        title: "Test mode (sandbox)",
                        items: [
                            "Click the \"Pay Now\" button to open the Midtrans simulator.",
                            "Paste the Virtual Account number, then click \"Inquire\".",
                            "Click \"Pay\" to complete the payment.",
                        ],
                    },
                ],
            },
            {
                id: "payment-qris",
                title: "QRIS",
                summary: "Pay with any e-wallet or mobile banking app that supports QRIS.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Choose \"QRIS\", then click \"Confirm & Pay\".",
                            "The payment page shows a QR code.",
                            "Scan the QR code with your e-wallet or mobile banking app and complete the payment before the deadline.",
                        ],
                    },
                    {
                        type: "note",
                        text: "QRIS only appears when it's enabled for that branch.",
                    },
                ],
            },
            {
                id: "payment-sgt",
                title: "Crypto (SGT)",
                summary: "Pay with Singapore Token (SGT) on the Sui network.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Make sure you have a Sui wallet (for example Slush) with enough SGT.",
                            "Choose \"Crypto\", then connect your wallet.",
                            "Click \"Confirm & Pay\".",
                            "Approve the transaction in your wallet. The SGT amount is calculated automatically from the Rupiah total.",
                            "Once the transaction is verified, you'll be taken to the payment success page.",
                        ],
                    },
                    {
                        type: "warning",
                        text: "If you reject the transaction in your wallet or it fails, the booking is not paid yet. Try again from the payment page.",
                    },
                ],
            },
            {
                id: "payment-credit",
                title: "Booking credit",
                summary: "Pay with credit from a refund or a cheaper reschedule.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Choose \"Credit\" as the payment method.",
                            "Click \"Bayar dengan Credit\" (Pay with Credit). Your balance is deducted and the booking is paid immediately.",
                        ],
                    },
                    {
                        type: "note",
                        text: "Your credit must cover the full total. If it's not enough, you'll see your balance and the shortfall. Choose another method to continue.",
                    },
                ],
                cta: { label: "Check credit balance", href: "/profile" },
            },
        ],
    },
    {
        id: "manage",
        title: "Managing bookings",
        topics: [
            {
                id: "manage-status",
                title: "Check booking status",
                summary: "All your active bookings are on the Recent Activity page.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Click \"Menu\", then choose \"Recent activity\".",
                            "Choose the Hotel Booking tab for rooms, or Food Order for food orders.",
                            "Click a booking to see its details: rooms, dates, payment, and status history.",
                        ],
                    },
                    {
                        type: "list",
                        title: "What each status means",
                        items: [
                            "Pending: waiting for payment.",
                            "Paid: payment received.",
                            "Confirmed: confirmed by reception on your arrival day.",
                            "Checked in / Checked out: you're staying / your stay is finished.",
                            "Cancelled: the booking was cancelled. You can request a refund.",
                            "Expired: not paid before the deadline.",
                        ],
                    },
                ],
                cta: { label: "Open Recent Activity", href: "/recent-activity" },
            },
            {
                id: "manage-checkin",
                title: "Check-in & check-out",
                summary: "Check in and out yourself from the Recent Activity page.",
                blocks: [
                    {
                        type: "steps",
                        title: "Check-in",
                        items: [
                            "Arrive at the hotel on your check-in date. Reception will confirm your booking (status becomes Confirmed).",
                            "Open Recent Activity and select the booking.",
                            "Click \"Check In\".",
                        ],
                    },
                    {
                        type: "steps",
                        title: "Check-out",
                        items: [
                            "On your check-out date, open your booking in Recent Activity.",
                            "Click \"Check Out\".",
                        ],
                    },
                    {
                        type: "note",
                        text: "The Check In button is only active on your check-in date after reception confirms the booking. The Check Out button is only active on your check-out date.",
                    },
                ],
            },
            {
                id: "manage-reschedule",
                title: "Reschedule (change dates)",
                summary: "Move your booking to other dates without cancelling.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Open Recent Activity, select the booking, then click \"Reschedule\".",
                            "Pick a new check-in date on the calendar. The number of nights stays the same, and the nightly price is shown on each date.",
                            "Click \"Continue to Confirmation\".",
                            "Review the calculation: the deduction from the policy, the remaining value of your old booking, the new booking price, and the difference. You can also pick another room for the new dates.",
                            "If the new booking costs more, choose a payment method for the difference and click \"Confirm & Pay\". If there's nothing to pay, click \"Confirm Reschedule\".",
                        ],
                    },
                    {
                        type: "list",
                        title: "Conditions",
                        items: [
                            "Only Paid or Confirmed bookings can be rescheduled, and only before the check-in date has passed.",
                            "The deduction depends on how many days before check-in you reschedule. Confirmed bookings use the check-in day policy.",
                            "If the new booking is cheaper, the rest goes to your booking credit automatically.",
                            "Your old booking stays valid until the difference is paid. If it isn't paid within 15 minutes, the reschedule is cancelled and your old booking is unchanged.",
                            "A booking can usually be rescheduled only once.",
                            "Bookings with more than one room can't be rescheduled yet.",
                        ],
                    },
                ],
                cta: { label: "Open Recent Activity", href: "/recent-activity" },
            },
            {
                id: "manage-cancel",
                title: "Cancel a booking",
                summary: "Cancel a booking and see your refund amount before deciding.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Open Recent Activity, select the booking, then click \"Cancel Booking\".",
                            "Review the preview: days before check-in, the refund percentage from the policy, and the refund amount.",
                            "Confirm the cancellation. The booking becomes Cancelled and the rooms are released.",
                            "Then request your refund (see the Refund topic).",
                        ],
                    },
                    {
                        type: "note",
                        text: "The preview is valid for 15 minutes. If it expires, start the cancellation again.",
                    },
                    {
                        type: "warning",
                        text: "A booking that is waiting for a reschedule difference payment can't be cancelled. Wait until that bill is paid or expires.",
                    },
                ],
            },
            {
                id: "manage-refund",
                title: "Refund",
                summary: "Request your money back for a cancelled booking.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Open Recent Activity and select the Cancelled booking.",
                            "Click \"Request Refund\".",
                            "Choose the refund type, Credit or Cash (if available), and enter a reason.",
                            "Submit. The refund is processed once an admin approves it.",
                        ],
                    },
                    {
                        type: "list",
                        title: "Credit vs Cash",
                        items: [
                            "Credit: once approved by an admin, the refund goes straight to your booking credit and is valid for 30 days.",
                            "Cash: the money is sent to your bank account after admin approval, at the earliest 4 days after you request it.",
                            "The Cash option only appears if the refund policy for that booking allows it.",
                        ],
                    },
                ],
                cta: { label: "Open Recent Activity", href: "/recent-activity" },
            },
            {
                id: "manage-history",
                title: "Booking history",
                summary: "See every booking you've made.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Click \"Menu\", then choose \"History\".",
                            "Filter by status to find a specific booking.",
                        ],
                    },
                ],
                cta: { label: "Open History", href: "/history" },
            },
        ],
    },
    {
        id: "credit",
        title: "Credit & withdraw",
        topics: [
            {
                id: "credit-balance",
                title: "Booking credit",
                summary: "A balance you can use for your next booking.",
                blocks: [
                    {
                        type: "list",
                        title: "Where credit comes from",
                        items: [
                            "Refunds you chose to receive as Credit.",
                            "The remaining value of your old booking when you reschedule to a cheaper one.",
                        ],
                    },
                    {
                        type: "steps",
                        title: "Check balance & history",
                        items: [
                            "Click \"Menu\", then choose \"Profile\".",
                            "Look at the Booking credit card: your available balance and the \"Valid until\" date.",
                            "Click \"View credit history\" to see every incoming and outgoing transaction.",
                        ],
                    },
                    {
                        type: "warning",
                        text: "Credit is valid for 30 days from the last time it was added. Use it for a booking or withdraw it before it expires.",
                    },
                ],
                cta: { label: "Open Profile", href: "/profile" },
            },
            {
                id: "credit-withdraw",
                title: "Withdraw credit",
                summary: "Withdraw your credit balance to a Sui wallet as SGT.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Open Profile, then click \"Withdraw\" on the Booking credit card.",
                            "Choose Crypto, then choose the Sui network.",
                            "Enter the amount in Rupiah (minimum Rp 10,000) and your Sui wallet address.",
                            "Click \"Preview Withdraw\" to see how much SGT you'll receive, the exchange rate, and your balance before and after.",
                            "Click \"Confirm & Submit\".",
                        ],
                    },
                    {
                        type: "list",
                        title: "Conditions",
                        items: [
                            "The preview is valid for 10 minutes.",
                            "Your credit balance is deducted as soon as you submit the request.",
                            "SGT is sent to your wallet once an admin approves the request.",
                            "Cash withdrawals aren't available yet.",
                        ],
                    },
                    {
                        type: "warning",
                        text: "Double-check your wallet address. Crypto transfers can't be reversed once sent.",
                    },
                ],
                cta: { label: "Open Profile", href: "/profile" },
            },
        ],
    },
    {
        id: "food",
        title: "Ordering food",
        topics: [
            {
                id: "food-order",
                title: "Order food",
                summary: "Order from the hotel restaurants and have it brought to your table.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Open the Food page. From the home page, click the \"The Grand Dining\" card in the facilities section.",
                            "Search the menu or filter by category and restaurant.",
                            "Add items to your cart and adjust the quantity.",
                            "Open the cart and continue to payment.",
                            "Sign in with Google if you haven't yet.",
                            "Enter your table location (required, for example \"Table 3, 2nd floor\") and any notes (allergies, special requests).",
                            "Continue to the Midtrans page and choose a payment method (Virtual Account or QRIS, depending on what's available).",
                        ],
                    },
                    {
                        type: "steps",
                        title: "Check your order status",
                        items: [
                            "Click \"Menu\", then choose \"Recent activity\".",
                            "Open the Food Order tab to see your order status and table location.",
                        ],
                    },
                ],
                cta: { label: "Order food", href: "/food" },
            },
        ],
    },
    {
        id: "help",
        title: "Help",
        topics: [
            {
                id: "help-chat",
                title: "Ask via chat",
                summary: "Still unsure? Ask us directly in the chat.",
                blocks: [
                    {
                        type: "steps",
                        items: [
                            "Click the chat icon in the bottom-right corner of the page.",
                            "Type your question about rooms, bookings, or hotel facilities.",
                        ],
                    },
                    {
                        type: "tip",
                        text: "You can open this guide any time from \"Menu\", then \"Guide\".",
                    },
                ],
            },
        ],
    },
];

export default eng;
