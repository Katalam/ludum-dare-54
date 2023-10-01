export class Sounds {
    static playSoundSchedulerReady() {
        Sounds.playSound('./assets/scheduler.wav');
    }

    static playSoundTruckExit() {
        Sounds.playSound('./assets/truck.wav');
    }

    static playSoundScore() {
        Sounds.playSound('./assets/score.wav');
    }

    private static playSound(sound: string) {
        const audio = new Audio(sound);
        audio.addEventListener('canplaythrough', () => {
            void audio.play();
        })
    }
}
