'use client';

// Action
import { signup } from "@/actions/auth.action";

// Components: UI
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";

// React
import { useActionState, useEffect, useState } from "react";

export function SignUpForm() {
    const [formData, setFormData] = useState({ studentId: '', username: '', password: '', confirmPassword: '', phoneNumber: '', email: '' });

    // Server Action
    const [state, formAction, isPending] = useActionState(signup, null);
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
                    <Input disabled={isPending} name="studentId" type="text" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} required />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="username">이름</Label>
                    </div>
                    <Input disabled={isPending} name="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="email">이메일</Label>
                    </div>
                    <Input disabled={isPending} name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">비밀번호</Label>
                    </div>
                    <PasswordInput disabled={isPending} name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                    </div>
                    <PasswordInput disabled={isPending} name="confirmPassword" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="phoneNumber">전화번호</Label>
                    </div>
                    <Input disabled={isPending} name="phoneNumber" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} required />
                </div>
                <div className="grid gap-2">
                    <div className="items-top flex space-x-2">
                        <Checkbox name="role" />
                        <div className="grid gap-1.5 leading-none">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                저는 학생회 입니다.
                            </label>
                            <p className="text-sm text-muted-foreground">
                                You agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
                <Button type="submit" className="w-full">회원가입</Button>
            </div>
        </form>
    )
}
