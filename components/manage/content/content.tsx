import Link from "next/link";
import { Button } from "../../ui/button";

export default function Content() {
    return (
        <section>
            <div>
                <Link href="/manage/levels">
                    <Button>Levels</Button>
                </Link>

                <Link href="/manage/topics">
                    <Button>Topics</Button>
                </Link>
                <Link href="/manage/notes">
                    <Button>Notes</Button>
                </Link>
            </div>
        </section>
    );
}
