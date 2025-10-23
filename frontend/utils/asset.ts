export const cardImages = [
    '/assets/sprite_0.png',
    '/assets/sprite_1.png',
    '/assets/sprite_2.png',
    '/assets/sprite_3.png',
    '/assets/sprite_4.png',
    '/assets/sprite_5.png',
    '/assets/sprite_6.png',
    '/assets/sprite_7.png',
    '/assets/sprite_8.png',
]

export function getCardImageById(cardId: number): string {
    console.log('Getting image for card ID:', cardId);
    const index = cardId % cardImages.length;
    return cardImages[index];
}