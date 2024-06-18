import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePasswordForm: React.FC = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }

        const formData = new FormData();
        formData.append("oldPassword", oldPassword);
        formData.append("newPassword", newPassword);

        const response = await fetch(
            `https://localhost:7153/api/user/change-password/${id}`,
            {
                method: "PUT",
                body: formData,
            }
        );

        if (response.ok) {
            alert("Mot de passe modifié avec succès");
            navigate(`/api/user/${id}`)
        } else {
            const errorData = await response.json();
            alert(`Erreur : ${errorData.message}`);
        }
    };

    return (
        <form className="max-w-sm" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="oldPassword" className="block mb-2">
                    Ancien mot de passe
                </label>
                <div className="relative">
                    <input
                        type={showOldPassword ? "text" : "password"}
                        id="oldPassword"
                        name="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                    />
                    <div
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                        {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="NewPassword" className="block mb-2">
                    Nouveau mot de passe
                </label>
                <div className="relative">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        id="NewPassword"
                        name="NewPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                    />
                    <div
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="confirmPassword" className="block mb-2">
                    Confirmation nouveau mot de passe
                </label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                    />
                    <div
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                </div>
            </div>
            
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Changer le mot de passe
            </button>
        </form>
    );
};

export default ChangePasswordForm;