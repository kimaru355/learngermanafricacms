import Link from "next/link";
import { Button } from "../../ui/button";

export default function Content() {
    return (
        <section>
            <div>
                <Link href="/content/levels">
                    <Button>Levels</Button>
                </Link>

                <Link href="/content/topics">
                    <Button>Topics</Button>
                </Link>
                <Link href="/content/notes">
                    <Button>Notes</Button>
                </Link>
            </div>
        </section>
    );
}
