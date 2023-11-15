function init() {
    let schedules, schedule;
    let answersGood = 0;
    let answersBad = 0;
    let evaluating = false;
    let wrongAnswers = [];
    let answerButtons;

    const nextButton = document.getElementById('next');
    const revealButton = document.getElementById('reveal');
    const scheduleContainer = document.getElementById('schedule');
    const counterGood = document.getElementById('counter_good');
    const counterBad = document.getElementById('counter_bad');
    const wrongAnswersPage = document.getElementById('wrongAnswersPage');
    const wrongAnswersContainer = document.getElementById('wrongAnswersContainer');
    const restartButton = document.getElementById('restart');

    const checkAnswer = (answer) => {
        if (evaluating) return;
        evaluating = true;
        if (answer === schedule.index) {
            answersGood++;
            answerButtons[answer].classList.add('good');
        } else {
            wrongAnswers.push(schedule);
            answersBad++;
            answerButtons[answer].classList.add('bad');
            answerButtons[schedule.index].classList.add('good');
        }
        counterGood.innerText = `${answersGood} (${Math.round(100 * answersGood / (answersGood + answersBad))}%)`;
        counterBad.innerText = `${answersBad} (${Math.round(100 * answersBad / (answersGood + answersBad))}%)`;

        if(schedules.length > 0) nextButton.classList.remove('hidden');
        else revealButton.classList.remove('hidden');
    };

    const updateSchedule = () => {
        const index = Math.floor(Math.random() * schedules.length);
        schedule = schedules.splice(index, 1)[0];

        scheduleContainer.replaceChildren(...schedule.value.map(({ title, value }) => {
            const titleContainer = document.createElement('div');
            titleContainer.className = 'scheduleTitle';
            titleContainer.innerText = title;
            const valueContainer = document.createElement('div');
            valueContainer.className = 'scheduleValue';
            valueContainer.innerText = value;
            return [titleContainer, valueContainer];
        }).flat());

        nextButton.classList.add('hidden');
        answerButtons.forEach(answerButton => answerButton.classList.remove('good', 'bad'));
        evaluating = false;
    };

    const revealWrongAnswers = () => {
        const html = wrongAnswers.map((schedule) => {
            const museumContainer = document.createElement('div');
            museumContainer.className = 'wrongAnswer';
            const museumNameContainer = document.createElement('div');
            museumNameContainer.className = 'scheduleMuseum';
            museumNameContainer.innerText = horarios[schedule.index].museo;
            const scheduleElements = schedule.value.map(({ title, value }) => {
                const titleContainer = document.createElement('div');
                titleContainer.className = 'scheduleTitle';
                titleContainer.innerText = title;
                const valueContainer = document.createElement('div');
                valueContainer.className = 'scheduleValue';
                valueContainer.innerText = value;
                return [titleContainer, valueContainer];
            });
            museumContainer.append(...[museumNameContainer, ...scheduleElements.flat()]);
            return museumContainer;
        });
        wrongAnswersContainer.replaceChildren(...html);
        wrongAnswersPage.classList.remove('hidden');
        revealButton.classList.add('hidden');
    };

    const restart = () => {
        schedules = horarios.map((museum, index) => ({ value: museum.horario, index }));

        answersGood = 0;
        answersBad = 0;
        evaluating = false;
        wrongAnswers = [];

        counterGood.innerText = '0 (0%)';
        counterBad.innerText = '0 (0%)';

        updateSchedule();

        wrongAnswersPage.classList.add('hidden');
    };

    const createMuseumsButtons = () => {
        answerButtons = horarios.map((museum, index) => {
            const container = document.createElement('div');
            container.id = `museum_${index}`;
            container.className = 'museumName';
            container.innerText = museum.museo;
            container.addEventListener('click', checkAnswer.bind(null, index));
            return container;
        });
        document.getElementById('choices').append(...answerButtons);
    };

    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('start').classList.add('hidden');
    }, { once: true });

    nextButton.addEventListener('click', updateSchedule);
    revealButton.addEventListener('click', revealWrongAnswers);
    restartButton.addEventListener('click', restart);

    createMuseumsButtons();
    restart();
}