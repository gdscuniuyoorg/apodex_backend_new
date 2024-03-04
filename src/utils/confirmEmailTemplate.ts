const confirmEmailTemplate = (): string => {
  return `<section class="max-w-2xl px-6 py-8 mx-auto bg-white dark:bg-gray-900">
    <header>
        <a href="#">
            <img class="w-auto h-7 sm:h-8" src="https://merakiui.com/images/full-logo.svg" alt="">
        </a>
    </header>

    <main class="mt-8">
        <h2 class="text-gray-700 dark:text-gray-200">Hi Olivia,</h2>

        <p class="mt-2 leading-loose text-gray-600 dark:text-gray-300">
            This is your verification code:
        </p>

        <div class="flex items-center mt-4 gap-x-4">
            <p class="flex items-center justify-center w-10 h-10 text-2xl font-medium text-blue-500 border border-blue-500 rounded-md dark:border-blue-400 dark:text-blue-400 ">6</p>
            <p class="flex items-center justify-center w-10 h-10 text-2xl font-medium text-blue-500 border border-blue-500 rounded-md dark:border-blue-400 dark:text-blue-400 ">2</p>
            <p class="flex items-center justify-center w-10 h-10 text-2xl font-medium text-blue-500 border border-blue-500 rounded-md dark:border-blue-400 dark:text-blue-400 ">8</p>
            <p class="flex items-center justify-center w-10 h-10 text-2xl font-medium text-blue-500 border border-blue-500 rounded-md dark:border-blue-400 dark:text-blue-400 ">9</p>
        </div>

        <p class="mt-4 leading-loose text-gray-600 dark:text-gray-300">
            This code will only be valid for the next 5 minutes. If the code does not work, you can use this login verification link:
        </p>
        
        <button class="px-6 py-2 mt-6 text-sm font-medium tracking-wider text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
            Verify email
        </button>
        
        <p class="mt-8 text-gray-600 dark:text-gray-300">
            Thanks, <br>
            Meraki UI team
        </p>
    </main>
    

    <footer class="mt-8">
        <p class="text-gray-500 dark:text-gray-400">
            This email was sent to <a href="#" class="text-blue-600 hover:underline dark:text-blue-400" target="_blank">contact@merakiui.com</a>. 
            If you'd rather not receive this kind of email, you can <a href="#" class="text-blue-600 hover:underline dark:text-blue-400">unsubscribe</a> or <a href="#" class="text-blue-600 hover:underline dark:text-blue-400">manage your email preferences</a>.
        </p>

        <p class="mt-3 text-gray-500 dark:text-gray-400">© {{ new Date().getFullYear() }} Meraki UI. All Rights Reserved.</p>
    </footer>
</section>`;
};

export default confirmEmailTemplate;
