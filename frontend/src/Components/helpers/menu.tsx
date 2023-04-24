import classNames from 'classnames';

const menuRaw = [
  { title: 'Brötchen', img: 'Brötchen.PNG' },
  { title: 'Frucht', img: 'Frucht.PNG' },
  { title: 'Kuchen', img: 'Kuchen.PNG' },
  { title: 'Popcorn', img: 'Popcorn.PNG' },
  { title: 'Sandwich', img: 'Sandwich.PNG' },
  { title: 'Kaffee', img: 'Kaffee.PNG' },
  { title: 'Tee heiss', img: 'Tee_heiss.PNG' },
  { title: 'Früchtetee kalt', img: 'Früchtetee_kalt.PNG' },
  { title: 'Wasser mit Frucht', img: 'Wasser_mit_Frucht.PNG' },
  { title: 'Sirup', img: 'Sirup.svg' },
  { title: 'Wasser', img: 'Wasser.PNG' },
];

const imageFactory = (title: string, img: string) => {
  return ({ className }: { className?: string }) => {
    return (
      <img
        className={classNames(className, 'w-20 h-20')}
        src={require('../../images/' + img)}
        alt={title}
      />
    );
  };
};

const menu = menuRaw.map(({ title, img }) => ({
  title,
  img: imageFactory(title, img),
}));

export default menu;
