'use client';

// Action
import { signin } from "@/actions/auth.action";

// Components: UI
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";

// React
import { useActionState, useEffect } from "react";

export function SigninForm() {
    // Server Action
    const [state, formAction, isPending] = useActionState(signin, null);
    useEffect(() => {
        if (state === null) return;
        if (state.status === 200) {
            toast.success(state.message);
        } else {
            state.message.split('\n').map((message) => toast.error(message));
        }
    }, [state]);

    return (
        <form action={formAction}>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="studentId">학번</Label>
                    <Input disabled={isPending} name="studentId" type="text" required />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">비밀번호</Label>
                    </div>
                    <PasswordInput disabled={isPending} name="password" required />
                </div>
                <Button type="submit" className="w-full">로그인</Button>
            </div>
        </form>
    )
}
